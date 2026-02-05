import Tesseract from 'tesseract.js';

export interface ExtractedData {
  merchant: string;
  amount: string;
  date: string;
  rawText: string;
}

export const processReceiptImage = async (imageFile: File): Promise<ExtractedData> => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      { logger: m => console.log(m) }
    );

    const text = result.data.text;
    console.log('OCR Output:', text);

    return {
      merchant: extractMerchant(text),
      amount: extractAmount(text),
      date: extractDate(text),
      rawText: text
    };
  } catch (error) {
    console.error("OCR Failed:", error);
    throw new Error("Failed to process image");
  }
};

const extractAmount = (text: string): string => {
  // Configurable regex to look for prices. 
  // We generally look for the largest number with roughly currency format (X.XX)
  // often preceded by 'Total', 'Amount', 'Grand Total'.
  
  const lines = text.split('\n');
  let maxAmount = 0.0;
  let foundAmountStr = "";

  // Regex to match currency: $12.34, 12.34, 1,234.56
  // We ignore symbols for parsing but look for patterns.
  const amountRegex = /(\d{1,3}(,\d{3})*(\.\d{2})?)/g;

  // Keyword priority check
  const totalKeywords = ['total', 'amount', 'balance', 'grand total', 'subtotal'];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // If line has keywords, it might contain the total
    const hasKeyword = totalKeywords.some(k => lowerLine.includes(k));
    
    // Find all numbers in line
    const matches = line.match(amountRegex);
    if (matches) {
       for (const match of matches) {
           // Cleanup number (remove commas)
           const cleanNum = parseFloat(match.replace(/,/g, ''));
           if (!isNaN(cleanNum)) {
             // Heuristic: The largest number on the receipt usually is the total, 
             // OR a number on a line with "Total". 
             // We'll prioritize "Total" lines, otherwise track max.
             if (hasKeyword) {
                 // High confidence if text says "Total"
                 if (cleanNum > maxAmount) {
                     maxAmount = cleanNum;
                     foundAmountStr = cleanNum.toFixed(2);
                 }
             } else {
                 if (cleanNum > maxAmount) {
                     // Keep track but lower priority if we find a keyword match later? 
                     // For simple logic, let's just track globally largest for now as fallback
                    //  maxAmount = cleanNum; 
                    //  foundAmountStr = cleanNum.toFixed(2);
                 }
             }
           }
       }
    }
  }

  // Second pass: if no keyword match found, just get the largest number that looks like a price at the bottom half?
  // Let's stick to global max for now if keyword failing.
  if (parseFloat(foundAmountStr) === 0) {
      const matches = text.match(amountRegex);
      if (matches) {
          const numbers = matches.map(m => parseFloat(m.replace(/,/g, ''))).filter(n => !isNaN(n));
          if (numbers.length > 0) {
              const max = Math.max(...numbers);
              foundAmountStr = max.toFixed(2);
          }
      }
  }

  return foundAmountStr || "0.00";
};

const extractDate = (text: string): string => {
  // Formats: MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY
  // We'll look for common patterns.
  const dateRegex = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/;
  const match = text.match(dateRegex);
  
  if (match) {
      return match[0];
  }
  
  // Return current date as fallback if not found
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const extractMerchant = (text: string): string => {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  // Heuristic: First line is often the merchant name
  if (lines.length > 0) {
      return lines[0].trim();
  }
  return "Unknown Merchant";
};
