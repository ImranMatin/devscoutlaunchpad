import jsPDF from "jspdf";
import { TailoredResume, CoverLetterData } from "./types";

export function downloadResumePDF(resume: TailoredResume, name: string) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  const addText = (text: string, fontSize: number, bold = false, indent = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    for (const line of lines) {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.text(line, margin + indent, y);
      y += fontSize * 0.5;
    }
  };

  // Name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(name, margin, y);
  y += 12;

  // Summary
  addText("SUMMARY", 11, true);
  y += 2;
  addText(resume.summary, 10);
  y += 8;

  // Technical Skills
  addText("TECHNICAL SKILLS", 11, true);
  y += 2;
  for (const cat of resume.technicalSkills) {
    addText(`${cat.category}: ${cat.skills.join(", ")}`, 10, false, 4);
    y += 2;
  }
  y += 6;

  // Projects
  addText("PROJECTS & ACHIEVEMENTS", 11, true);
  y += 2;
  for (const proj of resume.projects) {
    addText(`• ${proj}`, 10, false, 4);
    y += 2;
  }

  doc.save(`${name.replace(/\s+/g, "_")}_Tailored_Resume.pdf`);
}

export function downloadResumeWord(resume: TailoredResume, name: string) {
  const skillsHTML = resume.technicalSkills
    .map((cat) => `<p><strong>${cat.category}:</strong> ${cat.skills.join(", ")}</p>`)
    .join("");
  const projectsHTML = resume.projects.map((p) => `<li>${p}</li>`).join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${name} Resume</title>
    <style>body{font-family:Calibri,sans-serif;font-size:11pt;margin:1in;}h1{font-size:18pt;margin-bottom:4pt;}h2{font-size:13pt;margin-top:12pt;margin-bottom:4pt;text-transform:uppercase;border-bottom:1px solid #333;}p{margin:2pt 0;}ul{margin:4pt 0;padding-left:18pt;}</style>
    </head><body>
    <h1>${name}</h1>
    <h2>Summary</h2><p>${resume.summary}</p>
    <h2>Technical Skills</h2>${skillsHTML}
    <h2>Projects & Achievements</h2><ul>${projectsHTML}</ul>
    </body></html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "_")}_Tailored_Resume.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCoverLetterPDF(coverLetter: string, name: string, company: string) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(coverLetter, contentWidth);
  for (const line of lines) {
    if (y > 270) { doc.addPage(); y = margin; }
    doc.text(line, margin, y);
    y += 6;
  }

  doc.save(`${name.replace(/\s+/g, "_")}_Cover_Letter_${company.replace(/\s+/g, "_")}.pdf`);
}

export function downloadCoverLetterWord(coverLetter: string, name: string, company: string) {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Cover Letter</title>
    <style>body{font-family:Calibri,sans-serif;font-size:11pt;margin:1in;line-height:1.5;}</style>
    </head><body>${coverLetter.split("\n").map((p) => `<p>${p}</p>`).join("")}</body></html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "_")}_Cover_Letter_${company.replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
