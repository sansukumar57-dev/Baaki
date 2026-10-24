// Communication Templates for Escalation Ladder across English, Hindi, and Marathi

export const REMINDER_TEMPLATES = {
  heads_up: {
    stage: 'heads_up',
    name: 'Friendly Heads-up (-3 Days)',
    en: {
      subject: 'Upcoming invoice payment reminder from {businessName}',
      sms: 'Hi {customerName}, friendly reminder from {businessName}: Invoice {invoiceNumbers} for {amount} is due on {dueDate}. Pay here: {payLink}',
      whatsapp: 'Namaste {customerName} ji 🙏\n\nThis is a friendly reminder from *{businessName}* regarding upcoming invoice *{invoiceNumbers}* for *{amount}*, due on *{dueDate}*.\n\nKindly schedule payment at your convenience.\n🔗 View invoice & pay via UPI: {payLink}\n\nFor any query, contact {contactPerson} at {contactPhone}. Thank you!'
    },
    hi: {
      subject: '{businessName} से आगामी बिल भुगतान अनुस्मारक',
      sms: 'नमस्ते {customerName} जी, {businessName} का बिल {invoiceNumbers} (राशि {amount}) {dueDate} को देय है। यहाँ देखें: {payLink}',
      whatsapp: 'नमस्ते {customerName} जी 🙏\n\n*{businessName}* की ओर से एक विनम्र पूर्व-सूचना। आपका बिल क्रमांक *{invoiceNumbers}*, राशि *{amount}*, दिनांक *{dueDate}* को देय है।\n\nकृपया सुविधानुसार भुगतान शेड्यूल करें।\n🔗 बिल देखें व UPI से भुगतान करें: {payLink}\n\nकिसी भी प्रश्न के लिए संपर्क करें: {contactPerson} ({contactPhone})। धन्यवाद!'
    },
    mr: {
      subject: '{businessName} कडून आगामी बिलाचे स्मरणपत्र',
      sms: 'नमस्कार {customerName}, {businessName} चे बिल {invoiceNumbers} ({amount}) {dueDate} रोजी देय आहे. लिंक: {payLink}',
      whatsapp: 'नमस्कार {customerName} 🙏\n\n*{businessName}* कडून सस्नेह स्मरणपत्र. आपले बिल क्र. *{invoiceNumbers}*, रक्कम *{amount}*, दिनांक *{dueDate}* रोजी देय आहे.\n\nकृपया आपल्या सोयीनुसार देयकाची व्यवस्था करावी.\n🔗 बिल पहा व UPI ने भरा: {payLink}\n\nकाही अडचण असल्यास संपर्क: {contactPerson} ({contactPhone}). धन्यवाद!'
    }
  },

  due_date: {
    stage: 'due_date',
    name: 'Due Date Reminder (Day 0)',
    en: {
      subject: 'Invoice due today: {invoiceNumbers} from {businessName}',
      sms: 'Hello {customerName}, invoice {invoiceNumbers} for {amount} is due today. Please settle via {payLink}. Thanks, {businessName}.',
      whatsapp: 'Hello {customerName} ji 🙏\n\nYour invoice *{invoiceNumbers}* for *{amount}* from *{businessName}* is due for payment today (*{dueDate}*).\n\nKindly release the payment via bank transfer or instant UPI:\n🔗 Instant UPI Pay Link: {payLink}\n\nBank: Bank of Maharashtra | A/C: 60234567890 | IFSC: MAHB0000452\n\nThank you for your valued partnership!\n{contactPerson} ({contactPhone})'
    },
    hi: {
      subject: 'आज देय बिल: {invoiceNumbers} - {businessName}',
      sms: 'नमस्ते {customerName} जी, बिल {invoiceNumbers} ({amount}) आज देय है। कृपया भुगतान करें: {payLink}। {businessName}',
      whatsapp: 'नमस्ते {customerName} जी 🙏\n\n*{businessName}* की ओर से सादर। आपका बिल क्रमांक *{invoiceNumbers}* (राशि *{amount}*) आज *{dueDate}* को देय है।\n\nकृपया बैंक ट्रांसफर या UPI द्वारा भुगतान पूर्ण करें:\n🔗 तुरंत UPI से भुगतान करें: {payLink}\n\nबैंक: बैंक ऑफ महाराष्ट्र | खाता: 60234567890 | IFSC: MAHB0000452\n\nसहयोग के लिए धन्यवाद!\n{contactPerson} ({contactPhone})'
    },
    mr: {
      subject: 'आज देय असलेले बिल: {invoiceNumbers} - {businessName}',
      sms: 'नमस्कार {customerName}, बिल {invoiceNumbers} ({amount}) आज देय आहे. कृपया देयक भरा: {payLink}. {businessName}',
      whatsapp: 'नमस्कार {customerName} 🙏\n\n*{businessName}* कडून सादर स्मरण. आपले बिल क्र. *{invoiceNumbers}* (रक्कम *{amount}*) आज *{dueDate}* रोजी देय आहे.\n\nकृपया NEFT/IMPS किंवा UPI द्वारे पेमेंट करावे:\n🔗 त्वरित UPI पेमेंट लिंक: {payLink}\n\nबँक तपशील: Bank of Maharashtra | A/C: 60234567890 | IFSC: MAHB0000452\n\nआपल्या सहकार्याबद्दल धन्यवाद!\n{contactPerson} ({contactPhone})'
    }
  },

  firm_reminder: {
    stage: 'firm_reminder',
    name: 'Firmer Reminder (+7 Days Overdue)',
    en: {
      subject: 'Overdue payment reminder: {invoiceNumbers} ({daysOverdue} days past due) - {businessName}',
      sms: '{customerName}, invoice {invoiceNumbers} for {amount} is {daysOverdue} days overdue. Please clear immediately: {payLink}. - {businessName}',
      whatsapp: 'Dear {customerName} ji,\n\nWe bring to your urgent attention that invoice *{invoiceNumbers}* for *{amount}* is now *{daysOverdue} days overdue* (Due date was {dueDate}).\n\nAs our corrugated packaging raw material commitments require disciplined cash flow, we request you to clear this outstanding balance today:\n🔗 Click to view & pay: {payLink}\n\nIf you have already initiated this transfer, kindly share the bank UTR reference so we can reconcile our ledger.\n\nWarm regards,\n*{businessName}*\n{contactPerson} ({contactPhone})'
    },
    hi: {
      subject: 'अतिदेय भुगतान अनुस्मारक: बिल {invoiceNumbers} ({daysOverdue} दिन बाक़ी) - {businessName}',
      sms: '{customerName} जी, बिल {invoiceNumbers} ({amount}) {daysOverdue} दिनों से बकाया है। कृपया तुरंत भुगतान करें: {payLink}। {businessName}',
      whatsapp: 'प्रिय {customerName} जी,\n\nसादर ध्यानाकर्षण। आपका बिल क्रमांक *{invoiceNumbers}*, राशि *{amount}*, अब *{daysOverdue} दिनों से अतिदेय (overdue)* है (नियत तिथि {dueDate} थी)।\n\nहमारी कच्चा माल ख़रीद व फ़ैक्टरी परिचालन हेतु आपसे सादर अनुरोध है कि कृपया आज ही भुगतान पूर्ण करें:\n🔗 बिल देखें व भुगतान करें: {payLink}\n\nयदि आप भुगतान कर चुके हैं, तो कृपया बैंक UTR संदर्भ साझा करें।\n\nसादर,\n*{businessName}*\n{contactPerson} ({contactPhone})'
    },
    mr: {
      subject: 'थकीत देयक स्मरणपत्र: बिल {invoiceNumbers} ({daysOverdue} दिवस थकीत) - {businessName}',
      sms: '{customerName}, बिल {invoiceNumbers} ({amount}) {daysOverdue} दिवसांपासून थकीत आहे. कृपया त्वरित भरा: {payLink}. {businessName}',
      whatsapp: 'प्रिय {customerName},\n\nआपले लक्ष वेधून घेऊ इच्छितो की आपले बिल क्र. *{invoiceNumbers}*, रक्कम *{amount}*, आता *{daysOverdue} दिवसांपासून थकीत (overdue)* आहे.\n\nआमच्या कच्च्या मालाच्या खरेदी चक्रासाठी तातडीने निधी आवश्यक असल्याने, कृपया आजच हे देयक पूर्ण करावे ही विनंती:\n🔗 बिल पहा व थेट भरा: {payLink}\n\nपेमेंट केले असल्यास कृपया बँक UTR पाठवावा.\n\nआपला नम्र,\n*{businessName}*\n{contactPerson} ({contactPhone})'
    }
  },

  final_reminder: {
    stage: 'final_reminder',
    name: 'Final Reminder (+15 Days Overdue)',
    en: {
      subject: 'URGENT: Final payment reminder for Invoice {invoiceNumbers} ({daysOverdue} days overdue) - {businessName}',
      sms: 'URGENT: {customerName}, invoice {invoiceNumbers} ({amount}) is {daysOverdue} days overdue. Direct call requested. Pay: {payLink}',
      whatsapp: 'URGENT NOTICE\n\nDear {customerName},\n\nDespite previous reminders, invoice *{invoiceNumbers}* for *{amount}* remains unpaid and is now *{daysOverdue} days past the agreed 30-day credit term*.\n\nTo prevent interruption to future carton dispatches and credit limits, we request immediate settlement within 24 hours:\n🔗 Pay securely via UPI: {payLink}\n\nBank: Bank of Maharashtra | Current A/C: 60234567890 | IFSC: MAHB0000452\n\nI will also be calling your accounts team directly today to ensure this is resolved amicably.\n\nSincerely,\n*{businessName}*\n{contactPerson} | {contactPhone}'
    },
    hi: {
      subject: 'अत्यंत आवश्यक: बिल {invoiceNumbers} हेतु अंतिम अनुस्मारक ({daysOverdue} दिन विलंब)',
      sms: 'ज़रूरी: {customerName} जी, बिल {invoiceNumbers} ({amount}) {daysOverdue} दिनों से बकाया है। कृपया तुरंत देखें: {payLink}',
      whatsapp: 'अत्यंत महत्वपूर्ण सूचना\n\nप्रिय {customerName} जी,\n\nपूर्व सूचनाओं के बावजूद, बिल क्रमांक *{invoiceNumbers}*, राशि *{amount}*, अभी तक अप्राप्त है और *{daysOverdue} दिन विलंबित* हो चुका है।\n\nभविष्य की पैकिंग सप्लाय व क्रेडिट सीमा सुचारू रखने हेतु, कृपया अगले 24 घंटे में भुगतान करें:\n🔗 बिल व UPI भुगतान: {payLink}\n\nमैं आज आपके अकाउंट विभाग से सीधे फ़ोन पर भी चर्चा करूँगा ताकि इसका सौहार्दपूर्ण समाधान हो सके।\n\nधन्यवाद,\n*{businessName}*\n{contactPerson} | {contactPhone}'
    },
    mr: {
      subject: 'तातडीचे: बिल क्र. {invoiceNumbers} बाबत अंतिम स्मरणपत्र ({daysOverdue} दिवस थकीत)',
      sms: 'तातडीचे: {customerName}, बिल {invoiceNumbers} ({amount}) {daysOverdue} दिवस थकीत आहे. कृपया त्वरित भरा: {payLink}',
      whatsapp: 'अत्यंत तातडीचे स्मरणपत्र\n\nप्रिय {customerName},\n\nवारंवार स्मरण करूनही आपले बिल क्र. *{invoiceNumbers}*, रक्कम *{amount}*, अद्याप थकीत असून *{daysOverdue} दिवस उलटले आहेत*.\n\nपुढील कार्टन सप्लाय सुरळीत राहण्यासाठी कृपया पुढील २४ तासांत देयक अदा करावे:\n🔗 UPI ने भरा: {payLink}\n\nया विषयावर मी आज स्वतः आपल्या खात्याशी फोनवर चर्चा करत आहे.\n\nआपला नम्र,\n*{businessName}*\n{contactPerson} | {contactPhone}'
    }
  }
};
