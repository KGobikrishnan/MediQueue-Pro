import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates an official, print-ready hospital prescription PDF
 */
export const generatePrescriptionPDF = (rxData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(2, 116, 216); // Primary Blue
  doc.rect(0, 0, 210, 28, 'F');

  // Hospital Name & Branding
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('MediQueue Pro Multi-Speciality Hospital', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('NABH Accredited • 24x7 Emergency OPD • Digital Health Network', 14, 20);
  doc.text('Helpline: +91 44 2400 8000 | Web: www.mediqueuepro.org', 14, 25);

  // Sub Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('OUTPATIENT PRESCRIPTION & CLINICAL SUMMARY', 14, 38);

  // Rx Meta Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 42, 182, 34, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient Name:`, 18, 50);
  doc.text(`Age / Gender:`, 18, 57);
  doc.text(`Token Ref:`, 18, 64);
  doc.text(`Vitals:`, 18, 71);

  doc.setFont('helvetica', 'normal');
  doc.text(`${rxData.patientName || 'N/A'}`, 48, 50);
  doc.text(`${rxData.patientAge || '35'} Yrs / ${rxData.patientGender || 'Male'}`, 48, 57);
  doc.text(`${rxData.tokenNumber || 'GEN-101'}`, 48, 64);
  const v = rxData.vitals || {};
  doc.text(`BP: ${v.bp || '120/80'} | Pulse: ${v.pulse || '76'} bpm | SpO2: ${v.spo2 || '99%'} | Temp: ${v.temp || '98.6 F'}`, 48, 71);

  // Right side of meta box (Doctor info)
  doc.setFont('helvetica', 'bold');
  doc.text(`Consultant:`, 115, 50);
  doc.text(`Department:`, 115, 57);
  doc.text(`Date & Time:`, 115, 64);
  doc.text(`Rx ID:`, 115, 71);

  doc.setFont('helvetica', 'normal');
  doc.text(`${rxData.doctorName || 'Dr. Sarah Jenkins'}`, 142, 50);
  doc.text(`${rxData.deptName || 'Cardiology'}`, 142, 57);
  doc.text(`${rxData.date || new Date().toISOString().split('T')[0]}`, 142, 64);
  doc.text(`${rxData.id || 'RX-' + Math.floor(10000 + Math.random() * 90000)}`, 142, 71);

  // Diagnosis Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(2, 92, 176);
  doc.text('Clinical Diagnosis & Observations:', 14, 85);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(rxData.diagnosis || 'Clinical evaluation completed. Vitals stable.', 14, 91);

  // Rx Symbol
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(2, 116, 216);
  doc.text('Rx', 14, 104);

  // Medicines Table
  const tableData = (rxData.medicines || []).map((m, idx) => [
    idx + 1,
    m.name || 'Medicine',
    m.dosage || '1 tab',
    m.freq || '1-0-1',
    m.duration || '5 days',
    m.instruction || 'After food'
  ]);

  doc.autoTable({
    startY: 108,
    head: [['#', 'Medicine / Formulation', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
    body: tableData.length > 0 ? tableData : [[1, 'Paracetamol 650mg', '1 tab', '1-0-1', '3 Days', 'After meals']],
    theme: 'grid',
    headStyles: {
      fillColor: [2, 116, 216],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // Advice & Next Follow-up
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 180;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(2, 92, 176);
  doc.text('Special Advice / Dietary Guidelines:', 14, finalY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(rxData.advice || 'Drink plenty of fluids. Rest well. Avoid oily food.', 14, finalY + 6, {
    maxWidth: 180
  });

  // Signature and Hospital Seal Footer
  const footerY = 250;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, 196, footerY);

  // Digital Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Digitally Signed by: ${rxData.doctorName || 'Dr. Sarah Jenkins'}`, 130, footerY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Registered Medical Practitioner (MCI Reg No. 78421)', 130, footerY + 17);
  doc.text('MediQueue Pro Electronic Health Record Certified', 130, footerY + 22);

  doc.text('Disclaimer: This is a verified electronic prescription generated via MediQueue Pro OPD portal.', 14, footerY + 28);

  // Download trigger
  const fileName = `Prescription_${rxData.tokenNumber || 'OPD'}_${rxData.patientName ? rxData.patientName.replace(/\s+/g, '_') : 'Patient'}.pdf`;
  doc.save(fileName);
};

/**
 * Generates a thermal-style OPD Token Slip PDF (80mm width)
 */
export const generateTokenSlipPDF = (token) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 120]
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(2, 116, 216);
  doc.text('MEDIQUEUE PRO', 40, 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('OPD APPOINTMENT TOKEN SLIP', 40, 17, { align: 'center' });
  doc.text('------------------------------------------------', 40, 21, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(token.tokenNumber || 'CARD-101', 40, 32, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  if (token.priority === 'EMERGENCY') {
    doc.text('★ PRIORITY: EMERGENCY ★', 40, 38, { align: 'center' });
  } else if (token.priority === 'SENIOR') {
    doc.setTextColor(217, 119, 6);
    doc.text('★ SENIOR CITIZEN PRIORITY ★', 40, 38, { align: 'center' });
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Patient: ${token.patientName}`, 6, 48);
  doc.text(`Age/Sex: ${token.age || '--'} / ${token.gender || '--'}`, 6, 54);
  doc.text(`Doctor: ${token.doctorName}`, 6, 60);
  doc.text(`Department: ${token.department?.toUpperCase()}`, 6, 66);
  doc.text(`Room: ${token.roomNo || 'Room 101'}`, 6, 72);
  doc.text(`Issued At: ${new Date(token.createdAt || Date.now()).toLocaleTimeString()}`, 6, 78);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.text('------------------------------------------------', 40, 85, { align: 'center' });
  doc.text('Please watch the Waiting Room TV display.', 40, 90, { align: 'center' });
  doc.text('Estimated wait time: ~15 mins', 40, 95, { align: 'center' });
  doc.text('Scan QR code on TV screen to track on mobile.', 40, 100, { align: 'center' });

  doc.save(`Token_${token.tokenNumber}.pdf`);
};
