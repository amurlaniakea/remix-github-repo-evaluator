import { jsPDF } from "jspdf";
import { EvaluationResult, DependencyItem, CodeIssue, RepoScores } from "../types";

// Helper for status badge colors
function getStatusBadgeColors(status: string) {
  switch (status) {
    case "excellent":
      return { bg: [209, 250, 229], fg: [5, 150, 105] };
    case "good":
      return { bg: [219, 234, 254], fg: [37, 99, 235] };
    case "warning":
      return { bg: [254, 243, 199], fg: [217, 119, 6] };
    case "critical":
      return { bg: [255, 228, 230], fg: [225, 29, 72] };
    default:
      return { bg: [244, 244, 245], fg: [113, 113, 122] };
  }
}

// Helper for severity colors
function getSeverityColors(severity: string) {
  switch (severity) {
    case "high":
      return {
        bar: [225, 29, 72], // Rose 600
        bg: [255, 228, 230], // Rose 100
        fg: [225, 29, 72] // Rose 600
      };
    case "medium":
      return {
        bar: [217, 119, 6], // Amber 600
        bg: [254, 243, 199], // Amber 100
        fg: [217, 119, 6] // Amber 600
      };
    case "low":
      return {
        bar: [71, 85, 105], // Slate 600
        bg: [241, 245, 249], // Slate 100
        fg: [71, 85, 105] // Slate 600
      };
    default:
      return {
        bar: [113, 113, 122], // Zinc 500
        bg: [244, 244, 245], // Zinc 100
        fg: [113, 113, 122] // Zinc 500
      };
  }
}

// Helper for score categorization
function getScoreColors(score: number) {
  if (score >= 80) {
    return {
      bg: [209, 250, 229], // Emerald 100
      fg: [5, 150, 105], // Emerald 600
      label: "Excelente"
    };
  } else if (score >= 50) {
    return {
      bg: [254, 243, 199], // Amber 100
      fg: [217, 119, 6], // Amber 600
      label: "Aceptable"
    };
  } else {
    return {
      bg: [255, 228, 230], // Rose 100
      fg: [225, 29, 72], // Rose 600
      label: "Crítico"
    };
  }
}

class PDFBuilder {
  doc: jsPDF;
  y: number = 20;
  startX: number = 15;
  contentWidth: number = 180;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  // Ensures we have space or handles page breaks elegantly
  checkPageBreak(heightNeeded: number) {
    if (this.y + heightNeeded > 275) {
      this.drawFooter();
      this.doc.addPage();
      this.y = 25; // Reset y for new page
    }
  }

  // Draw running footer
  drawFooter() {
    const pageCount = this.doc.getNumberOfPages();
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.setTextColor(161, 161, 170); // Zinc 400
    this.doc.text(
      `Página ${pageCount} | RepoSense Reporte de Evaluación - Generado automáticamente`,
      105,
      287,
      { align: "center" }
    );
  }

  // Draw header block on page 1
  drawMainHeader(result: EvaluationResult) {
    // Decorative green top line
    this.doc.setFillColor(16, 185, 129); // Emerald 500
    this.doc.rect(15, 15, 180, 2, "F");
    this.y = 25;

    // App name / title
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(24);
    this.doc.setTextColor(9, 9, 11); // Zinc 950
    this.doc.text("RepoSense", this.startX, this.y);

    // Version tag
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.setTextColor(113, 113, 122); // Zinc 500
    this.doc.text("v1.2", this.startX + 50, this.y - 1);

    this.y += 6;

    // Report title
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(14);
    this.doc.setTextColor(39, 39, 42); // Zinc 800
    this.doc.text("REPORTE DE EVALUACIÓN DE REPOSITORIO", this.startX, this.y);

    this.y += 5;

    // Date
    const todayStr = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.setTextColor(113, 113, 122); // Zinc 500
    this.doc.text(`Fecha de emisión: ${todayStr}`, this.startX, this.y);

    this.y += 10;

    // Draw Repository Details Card
    this.drawRepositoryMetaCard(result);
  }

  drawRepositoryMetaCard(result: EvaluationResult) {
    const cardHeight = 32;
    this.checkPageBreak(cardHeight);

    // Card background
    this.doc.setFillColor(250, 250, 250);
    this.doc.rect(this.startX, this.y, this.contentWidth, cardHeight, "F");

    // Card border
    this.doc.setDrawColor(228, 228, 231); // Zinc 200
    this.doc.setLineWidth(0.4);
    this.doc.rect(this.startX, this.y, this.contentWidth, cardHeight, "S");

    // Decorative emerald left bar on the meta card
    this.doc.setFillColor(16, 185, 129);
    this.doc.rect(this.startX, this.y, 1.5, cardHeight, "F");

    // Owner and Repo title
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.setTextColor(24, 24, 27); // Zinc 900
    const repoFullName = `${result.owner} / ${result.repoName}`;
    this.doc.text(repoFullName, this.startX + 5, this.y + 7);

    // Primary language badge
    const lang = result.language || "Código";
    this.doc.setFillColor(236, 253, 245); // Emerald 50
    this.doc.rect(this.startX + 5, this.y + 11, 24, 5, "F");
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(5, 150, 105); // Emerald 600
    this.doc.text(lang, this.startX + 17, this.y + 14.5, { align: "center" });

    // Repository Description
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(82, 82, 91); // Zinc 600
    const descText = result.description || "Sin descripción proporcionada.";
    const descLines = this.doc.splitTextToSize(descText, this.contentWidth - 15);
    let descY = this.y + 21;
    descLines.forEach((line: string, idx: number) => {
      if (idx < 2) {
        this.doc.text(line, this.startX + 5, descY);
        descY += 4.5;
      }
    });

    // Draw Stats Badges on the right side of the card
    const badgesXStart = this.startX + this.contentWidth - 55;
    const badgeW = 15;
    const badgeH = 12;

    // Stars Badge
    this.drawStatSubBadge("Stars", result.stars.toString(), badgesXStart, this.y + 5, badgeW, badgeH);
    // Forks Badge
    this.drawStatSubBadge("Forks", result.forks.toString(), badgesXStart + 18, this.y + 5, badgeW, badgeH);
    // Files Badge
    const fileCount = result.tree ? result.tree.length : 0;
    this.drawStatSubBadge("Archivos", fileCount.toString(), badgesXStart + 36, this.y + 5, badgeW, badgeH);

    this.y += cardHeight + 8;
  }

  drawStatSubBadge(label: string, value: string, x: number, y: number, w: number, h: number) {
    this.doc.setFillColor(244, 244, 245); // Zinc 100 bg
    this.doc.rect(x, y, w, h, "F");

    this.doc.setDrawColor(228, 228, 231);
    this.doc.setLineWidth(0.3);
    this.doc.rect(x, y, w, h, "S");

    // Value
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(24, 24, 27);
    this.doc.text(value, x + w / 2, y + 5, { align: "center" });

    // Label
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(6.5);
    this.doc.setTextColor(113, 113, 122);
    this.doc.text(label.toUpperCase(), x + w / 2, y + 9.5, { align: "center" });
  }

  // Draw standard section header with green accent box
  addSectionDivider(title: string) {
    this.checkPageBreak(25);
    this.y += 4;

    // Green marker
    this.doc.setFillColor(16, 185, 129);
    this.doc.rect(this.startX, this.y, 4, 8, "F");

    // Title
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(13);
    this.doc.setTextColor(24, 24, 27);
    this.doc.text(title, this.startX + 6, this.y + 6.5);

    this.y += 10;

    // Thin grey border line
    this.doc.setDrawColor(244, 244, 245);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.startX, this.y, this.startX + this.contentWidth, this.y);
    this.y += 6;
  }

  // Render score matrices beautifully in a row
  drawScoresRow(scores: RepoScores) {
    const cardHeight = 22;
    this.checkPageBreak(cardHeight + 4);

    const gap = 3.5;
    const totalCards = 5;
    const cardWidth = (this.contentWidth - gap * (totalCards - 1)) / totalCards;

    const metrics = [
      { key: "General", score: scores.overall },
      { key: "Dependencias", score: scores.dependencies },
      { key: "Legibilidad", score: scores.legibility },
      { key: "Pruebas", score: scores.tests },
      { key: "Fiabilidad", score: scores.reliability }
    ];

    let currentX = this.startX;

    metrics.forEach((metric) => {
      const colors = getScoreColors(metric.score);

      // Background colored box
      this.doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
      this.doc.rect(currentX, this.y, cardWidth, cardHeight, "F");

      // Card border
      this.doc.setDrawColor(colors.fg[0], colors.fg[1], colors.fg[2]);
      this.doc.setLineWidth(0.4);
      this.doc.rect(currentX, this.y, cardWidth, cardHeight, "S");

      // Label
      this.doc.setFont("Helvetica", "bold");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(39, 39, 42); // Zinc 800
      this.doc.text(metric.key.toUpperCase(), currentX + cardWidth / 2, this.y + 5, { align: "center" });

      // Score
      this.doc.setFont("Helvetica", "bold");
      this.doc.setFontSize(15);
      this.doc.setTextColor(colors.fg[0], colors.fg[1], colors.fg[2]);
      this.doc.text(`${metric.score}`, currentX + cardWidth / 2, this.y + 12.5, { align: "center" });

      // Rating Label
      this.doc.setFont("Helvetica", "normal");
      this.doc.setFontSize(7);
      this.doc.setTextColor(colors.fg[0], colors.fg[1], colors.fg[2]);
      this.doc.text(colors.label, currentX + cardWidth / 2, this.y + 18, { align: "center" });

      currentX += cardWidth + gap;
    });

    this.y += cardHeight + 8;
  }

  // Draw standard dynamic height paragraph text
  addParagraph(text: string, size: number = 9.5, isBold: boolean = false, textColor = [63, 63, 70]) {
    this.doc.setFont("Helvetica", isBold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    const spacing = size * 0.45;

    lines.forEach((line: string) => {
      this.checkPageBreak(spacing + 2);
      this.doc.text(line, this.startX, this.y);
      this.y += spacing;
    });
    this.y += 3; // Space after paragraph
  }

  // Draw clean bullet point items with green bullets
  addBulletPoint(text: string) {
    const indent = 5;
    const bulletSymbol = "•";

    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(63, 63, 70);

    const maxW = this.contentWidth - indent;
    const lines = this.doc.splitTextToSize(text, maxW);

    lines.forEach((line: string, index: number) => {
      this.checkPageBreak(5);
      if (index === 0) {
        // Draw bullet symbol
        this.doc.setFont("Helvetica", "bold");
        this.doc.setTextColor(16, 185, 129); // Emerald Bullet
        this.doc.text(bulletSymbol, this.startX + 2, this.y);

        // Draw line text
        this.doc.setFont("Helvetica", "normal");
        this.doc.setTextColor(63, 63, 70);
        this.doc.text(line, this.startX + indent, this.y);
      } else {
        this.doc.text(line, this.startX + indent, this.y);
      }
      this.y += 5;
    });
    this.y += 2; // Spacing after bullet
  }

  // Draw cards for each audited dependency item
  addDependencyCard(item: DependencyItem) {
    const nameText = `${item.name} (${item.version})`;
    const recText = item.recommendation;

    const recLines = this.doc.splitTextToSize(recText, this.contentWidth - 10);
    const cardHeight = 12 + recLines.length * 4.5;

    this.checkPageBreak(cardHeight + 4);

    // Card background
    this.doc.setFillColor(252, 252, 252);
    this.doc.rect(this.startX, this.y, this.contentWidth, cardHeight, "F");

    // Card boundary line
    this.doc.setDrawColor(228, 228, 231);
    this.doc.setLineWidth(0.3);
    this.doc.rect(this.startX, this.y, this.contentWidth, cardHeight, "S");

    // Title text: Dependency package & version
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(24, 24, 27);
    this.doc.text(nameText, this.startX + 4, this.y + 6);

    // Status Badge on the right
    const statusColors = getStatusBadgeColors(item.status);
    const badgeWidth = 24;
    this.doc.setFillColor(statusColors.bg[0], statusColors.bg[1], statusColors.bg[2]);
    this.doc.rect(this.startX + this.contentWidth - badgeWidth - 4, this.y + 3, badgeWidth, 5.5, "F");

    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(6.5);
    this.doc.setTextColor(statusColors.fg[0], statusColors.fg[1], statusColors.fg[2]);
    this.doc.text(item.status.toUpperCase(), this.startX + this.contentWidth - badgeWidth / 2 - 4, this.y + 6.8, { align: "center" });

    // Recommendation block
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(82, 82, 91); // Gray 600

    let recY = this.y + 11;
    recLines.forEach((line: string) => {
      this.doc.text(line, this.startX + 4, recY);
      recY += 4.5;
    });

    this.y += cardHeight + 4;
  }

  // Draw cards for code issues & suggested fixes
  addIssueCard(issue: CodeIssue) {
    let neededHeight = 12;

    const titleLines = this.doc.splitTextToSize(issue.title, this.contentWidth - 30);
    neededHeight += titleLines.length * 4.5;

    if (issue.file) {
      neededHeight += 5;
    }

    const descLines = this.doc.splitTextToSize(issue.description, this.contentWidth - 10);
    neededHeight += descLines.length * 4.5;

    let fixLines: string[] = [];
    if (issue.fix) {
      fixLines = this.doc.splitTextToSize(`Sugerencia de corrección:\n${issue.fix}`, this.contentWidth - 16);
      neededHeight += 8 + fixLines.length * 4;
    }

    this.checkPageBreak(neededHeight + 6);

    const severityColors = getSeverityColors(issue.severity);

    // Background block
    this.doc.setFillColor(253, 253, 253);
    this.doc.rect(this.startX, this.y, this.contentWidth, neededHeight, "F");

    // Border
    this.doc.setDrawColor(228, 228, 231);
    this.doc.setLineWidth(0.3);
    this.doc.rect(this.startX, this.y, this.contentWidth, neededHeight, "S");

    // Colored left border based on severity
    this.doc.setFillColor(severityColors.bar[0], severityColors.bar[1], severityColors.bar[2]);
    this.doc.rect(this.startX, this.y, 1.5, neededHeight, "F");

    let currentCardY = this.y + 5;

    // Issue Title
    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.setTextColor(24, 24, 27);
    titleLines.forEach((line: string) => {
      this.doc.text(line, this.startX + 5, currentCardY);
      currentCardY += 4.5;
    });

    // Severity Badge on top right of the card
    const badgeWidth = 20;
    this.doc.setFillColor(severityColors.bg[0], severityColors.bg[1], severityColors.bg[2]);
    this.doc.rect(this.startX + this.contentWidth - badgeWidth - 4, this.y + 4, badgeWidth, 5, "F");

    this.doc.setFont("Helvetica", "bold");
    this.doc.setFontSize(6.5);
    this.doc.setTextColor(severityColors.fg[0], severityColors.fg[1], severityColors.fg[2]);
    this.doc.text(issue.severity.toUpperCase(), this.startX + this.contentWidth - badgeWidth / 2 - 4, this.y + 7.5, { align: "center" });

    // File target (if specified)
    if (issue.file) {
      this.doc.setFont("Courier", "oblique");
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(113, 113, 122);
      this.doc.text(`Archivo: ${issue.file}`, this.startX + 5, currentCardY);
      currentCardY += 5;
    }

    // Issue Description text
    this.doc.setFont("Helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(63, 63, 70);
    descLines.forEach((line: string) => {
      this.doc.text(line, this.startX + 5, currentCardY);
      currentCardY += 4.5;
    });

    // Suggested code block fix
    if (issue.fix) {
      currentCardY += 2;
      const fixHeight = 5 + fixLines.length * 4;
      this.doc.setFillColor(244, 244, 245); // Zinc 100
      this.doc.rect(this.startX + 5, currentCardY, this.contentWidth - 10, fixHeight, "F");

      this.doc.setFont("Courier", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(39, 39, 42); // Zinc 800

      let fixTextY = currentCardY + 4;
      fixLines.forEach((line: string) => {
        this.doc.text(line, this.startX + 8, fixTextY);
        fixTextY += 4;
      });

      currentCardY += fixHeight;
    }

    this.y += neededHeight + 4;
  }
}

export function generateReportPDF(result: EvaluationResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const builder = new PDFBuilder(doc);

  // 1. HEADER SECTION (Page 1 cover metrics card)
  builder.drawMainHeader(result);

  // 2. EXECUTIVE SCORE ROW (Overview)
  builder.addSectionDivider("1. EVALUACIÓN Y PUNTAJES GENERALES");
  builder.drawScoresRow(result.scores);

  // 3. ARCHITECTURAL SUMMARY SECTION
  builder.addSectionDivider("2. INFORME ARQUITECTÓNICO");
  builder.addParagraph(result.analysis.summary);

  // 4. DEPENDENCY AUDITING SECTION
  builder.addSectionDivider("3. AUDITORÍA DE DEPENDENCIAS Y PAQUETES");
  builder.addParagraph(result.analysis.dependencies.details);
  
  if (result.analysis.dependencies.items && result.analysis.dependencies.items.length > 0) {
    result.analysis.dependencies.items.forEach((item) => {
      builder.addDependencyCard(item);
    });
  } else {
    builder.addParagraph("No se encontraron dependencias particulares auditadas en el reporte.", 9, false, [161, 161, 170]);
  }

  // 5. LEGIBILITY & STYLE
  builder.addSectionDivider("4. LEGIBILIDAD, MANTENIBILIDAD Y ESTILO");
  builder.addParagraph(result.analysis.legibility.details);

  if (result.analysis.legibility.highlights && result.analysis.legibility.highlights.length > 0) {
    builder.addParagraph("Aspectos clave de legibilidad detectados:", 9.5, true);
    result.analysis.legibility.highlights.forEach((hl) => {
      builder.addBulletPoint(hl);
    });
  }

  // 6. TESTING QUALITY
  builder.addSectionDivider("5. COBERTURA Y CALIDAD DE PRUEBAS (TESTS)");
  builder.addParagraph(result.analysis.tests.details);
  
  // Quick stats card for coverage
  builder.checkPageBreak(18);
  builder.doc.setFillColor(244, 244, 245);
  builder.doc.rect(builder.startX, builder.y, builder.contentWidth, 12, "F");
  builder.doc.setDrawColor(228, 228, 231);
  builder.doc.setLineWidth(0.3);
  builder.doc.rect(builder.startX, builder.y, builder.contentWidth, 12, "S");
  
  builder.doc.setFont("Helvetica", "bold");
  builder.doc.setFontSize(9);
  builder.doc.setTextColor(24, 24, 27);
  builder.doc.text(`COBERTURA ESTIMADA: ${result.analysis.tests.coverageEst}`, builder.startX + 5, builder.y + 7.5);
  builder.y += 18;

  // 7. ISSUES & BUGS TARGETED
  const issueCount = result.analysis.issues ? result.analysis.issues.length : 0;
  builder.addSectionDivider(`6. ERRORES, FALENCIAS E ISSUES DETECTADOS (${issueCount})`);
  
  if (result.analysis.issues && result.analysis.issues.length > 0) {
    result.analysis.issues.forEach((issue) => {
      builder.addIssueCard(issue);
    });
  } else {
    builder.addParagraph("Excelente: ¡No se detectaron errores críticos ni issues de seguridad en el análisis estático!", 10, true, [5, 150, 105]);
  }

  // Draw footer on last page before saving
  builder.drawFooter();

  // Save/Download the file
  const fileName = `Reporte_${result.owner}_${result.repoName}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, "_");
  doc.save(fileName);
}
