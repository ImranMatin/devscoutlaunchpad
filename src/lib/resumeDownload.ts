import jsPDF from "jspdf";
import { TailoredResume } from "./types";

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

  const addSection = (title: string) => {
    y += 6;
    addText(title, 11, true);
    y += 2;
  };

  // Name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(name, margin, y);
  y += 6;

  // Contact Info
  const contactParts: string[] = [];
  if (resume.contactInfo?.location) contactParts.push(resume.contactInfo.location);
  if (resume.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (resume.contactInfo?.email) contactParts.push(resume.contactInfo.email);
  if (contactParts.length) {
    addText(contactParts.join(" | "), 9);
    y += 2;
  }

  const linkParts: string[] = [];
  if (resume.links?.portfolio) linkParts.push(`Portfolio: ${resume.links.portfolio}`);
  if (resume.links?.linkedin) linkParts.push(`LinkedIn: ${resume.links.linkedin}`);
  if (resume.links?.github) linkParts.push(`GitHub: ${resume.links.github}`);
  if (linkParts.length) {
    addText(linkParts.join(" | "), 8);
    y += 2;
  }

  // Summary
  addSection("SUMMARY");
  addText(resume.summary, 10);

  // Technical Skills
  addSection("TECHNICAL SKILLS");
  for (const cat of resume.technicalSkills) {
    addText(`${cat.category}: ${cat.skills.join(", ")}`, 10, false, 4);
    y += 2;
  }

  // Experience
  if (resume.experience?.length) {
    addSection("RELEVANT EXPERIENCE");
    for (const exp of resume.experience) {
      addText(`${exp.company}`, 10, true, 0);
      addText(`${exp.role} | ${exp.dates}`, 9, false, 0);
      y += 1;
      for (const bullet of exp.bullets) {
        addText(`• ${bullet}`, 9, false, 4);
        y += 1;
      }
      y += 3;
    }
  }

  // Projects
  if (resume.projects?.length) {
    addSection("PROJECTS & ACHIEVEMENTS");
    for (const proj of resume.projects) {
      addText(`• ${proj}`, 10, false, 4);
      y += 2;
    }
  }

  // Hackathons
  if (resume.hackathons?.length) {
    addSection("HACKATHON ACHIEVEMENTS");
    for (const h of resume.hackathons) {
      addText(h.name, 10, true, 0);
      addText(h.achievement, 9, false, 4);
      addText(h.description, 9, false, 4);
      y += 3;
    }
  }

  // Education
  if (resume.education?.length) {
    addSection("EDUCATION");
    for (const edu of resume.education) {
      addText(`${edu.institution} | ${edu.degree} | ${edu.dates}`, 10, false, 0);
      y += 2;
    }
  }

  doc.save(`${name.replace(/\s+/g, "_")}_Tailored_Resume.pdf`);
}

export function downloadResumeWord(resume: TailoredResume, name: string) {
  const skillsHTML = resume.technicalSkills
    .map((cat) => `<p><strong>${cat.category}:</strong> ${cat.skills.join(", ")}</p>`)
    .join("");

  const contactParts: string[] = [];
  if (resume.contactInfo?.location) contactParts.push(resume.contactInfo.location);
  if (resume.contactInfo?.phone) contactParts.push(resume.contactInfo.phone);
  if (resume.contactInfo?.email) contactParts.push(resume.contactInfo.email);

  const linkParts: string[] = [];
  if (resume.links?.portfolio) linkParts.push(`Portfolio`);
  if (resume.links?.linkedin) linkParts.push(`LinkedIn`);
  if (resume.links?.github) linkParts.push(`GitHub`);

  const experienceHTML = (resume.experience || []).map(exp =>
    `<p><strong>${exp.company}</strong><br/>${exp.role} | ${exp.dates}</p><ul>${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`
  ).join("");

  const projectsHTML = resume.projects.map((p) => `<li>${p}</li>`).join("");

  const hackathonsHTML = (resume.hackathons || []).map(h =>
    `<p><strong>${h.name}</strong> — ${h.achievement}<br/>${h.description}</p>`
  ).join("");

  const educationHTML = (resume.education || []).map(e =>
    `<p>${e.institution} | ${e.degree} | ${e.dates}</p>`
  ).join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${name} Resume</title>
    <style>body{font-family:Calibri,sans-serif;font-size:11pt;margin:1in;}h1{font-size:18pt;margin-bottom:2pt;}h2{font-size:13pt;margin-top:12pt;margin-bottom:4pt;text-transform:uppercase;border-bottom:1px solid #333;}p{margin:2pt 0;}ul{margin:4pt 0;padding-left:18pt;}.contact{font-size:9pt;color:#555;}</style>
    </head><body>
    <h1>${name}</h1>
    ${contactParts.length ? `<p class="contact">${contactParts.join(" | ")}</p>` : ""}
    ${linkParts.length ? `<p class="contact">${linkParts.join(" | ")}</p>` : ""}
    <h2>Summary</h2><p>${resume.summary}</p>
    <h2>Technical Skills</h2>${skillsHTML}
    ${experienceHTML ? `<h2>Relevant Experience</h2>${experienceHTML}` : ""}
    ${projectsHTML ? `<h2>Projects & Achievements</h2><ul>${projectsHTML}</ul>` : ""}
    ${hackathonsHTML ? `<h2>Hackathon Achievements</h2>${hackathonsHTML}` : ""}
    ${educationHTML ? `<h2>Education</h2>${educationHTML}` : ""}
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
