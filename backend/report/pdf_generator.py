import base64
import io
import uuid
from typing import Any, Dict, List
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

class PDFGenerator:
    """
    Generate a professional, comprehensive PDF report for Construction Cost Estimation.
    Includes project details, detailed pin-to-pin breakdown, AI analysis, 
    upgrades, terms, and digital signature.
    """

    def __init__(self, payload: Dict[str, Any], output_stream: Any):
        self.payload = payload
        self.breakdown = payload.get("breakdown", {})
        self.explanation = payload.get("explanation", {})
        # Normalize upgrades to a list of features
        raw_upgrades = payload.get("active_upgrade_features", payload.get("upgrades", []))
        if isinstance(raw_upgrades, dict):
            # If it's the raw selection dict, we convert it to displayable items if possible
            # But usually we expect active_upgrade_features (the list)
            self.upgrades = []
        else:
            self.upgrades = raw_upgrades
        self.output_stream = output_stream
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        self.styles.add(ParagraphStyle(
            name='CenterTitle',
            parent=self.styles['Title'],
            alignment=TA_CENTER,
            fontSize=22,
            spaceAfter=20,
            textColor=colors.HexColor('#1e40af')
        ))
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=12,
            spaceAfter=8,
            textColor=colors.HexColor('#1e40af'),
            borderRadius=3,
            backColor=colors.HexColor('#f3f4f6'),
            borderPadding=4
        ))
        self.styles.add(ParagraphStyle(
            name='FooterText',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#6b7280'),
            italic=True
        ))

    def _format_currency(self, value: Any) -> str:
        try:
            val = float(value)
            return f"Rs. {val:,.0f}"
        except (ValueError, TypeError):
            return str(value)

    def _get_signature_image(self, base64_str: str):
        if not base64_str or not isinstance(base64_str, str) or "base64," not in base64_str:
            return None
        try:
            header, encoded = base64_str.split(",", 1)
            img_data = base64.b64decode(encoded)
            img_io = io.BytesIO(img_data)
            return Image(img_io, width=1.5*inch, height=0.75*inch)
        except Exception as e:
            print(f"Error processing signature image: {e}")
            return None

    def generate_pdf(self) -> None:
        try:
            doc = SimpleDocTemplate(self.output_stream, pagesize=(8.5*inch, 11*inch), 
                                   leftMargin=0.75*inch, rightMargin=0.75*inch, 
                                   topMargin=0.75*inch, bottomMargin=0.75*inch)
            elements = []

            elements.append(Paragraph("Construction Cost Audit 2026", self.styles['CenterTitle']))
            
            gen_date = self.payload.get('generated_at', 'Feb 17, 2026')
            project_id = self.payload.get('project_id', f"AUDIT-{uuid.uuid4().hex[:8].upper()}")
            elements.append(Paragraph(f"<b>Audit Date:</b> {gen_date}", self.styles['Normal']))
            elements.append(Paragraph(f"<b>Project ID:</b> {project_id}", self.styles['Normal']))
            elements.append(Spacer(1, 0.2 * inch))

            elements.append(Paragraph("01. Project Specifications", self.styles['SectionHeading']))
            spec_data = [
                ["Project Type", str(self.payload.get('project_type', 'N/A')).replace('-', ' ').title()],
                ["Plot Details", str(self.payload.get('plot_size', 'N/A'))],
                ["Floors", str(self.payload.get('floors', 'N/A'))],
                ["Interior Tier", str(self.payload.get('interior', 'None')).title()],
            ]
            
            spec_table = Table(spec_data, colWidths=[2*inch, 4.5*inch])
            spec_table.setStyle(TableStyle([
                ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f9fafb')),
                ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
                ('PADDING', (0,0), (-1,-1), 6),
            ]))
            elements.append(spec_table)
            elements.append(Spacer(1, 0.2 * inch))

            try:
                elements.append(Paragraph("02. Technical Cost Audit", self.styles['SectionHeading']))
                breakdown_items = self.breakdown.get("pin_to_pin_details", []) if isinstance(self.breakdown, dict) else []
                if breakdown_items and isinstance(breakdown_items, list):
                    table_data = [["Category", "Item Description", "Amount"]]
                    for item in breakdown_items:
                        if isinstance(item, dict):
                            table_data.append([
                                item.get("category", ""),
                                item.get("item", ""),
                                self._format_currency(item.get("amount", 0))
                            ])
                    
                    audit_table = Table(table_data, colWidths=[1.5*inch, 3.5*inch, 1.5*inch], repeatRows=1)
                    audit_table.setStyle(TableStyle([
                        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1f2937')),
                        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                        ('ALIGN', (2,1), (2,-1), 'RIGHT'),
                        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0,0), (-1,0), 9),
                        ('PADDING', (0,0), (-1,-1), 4),
                    ]))
                    elements.append(audit_table)
                else:
                    elements.append(Paragraph("Detailed audit logs not available.", self.styles['Normal']))
            except Exception as e:
                print(f"Warning: Could not process breakdown details: {e}")
                elements.append(Paragraph("Detailed audit logs not available.", self.styles['Normal']))
            
            elements.append(Spacer(1, 0.2 * inch))

            # 3. Project Deliverables (Active Upgrades)
            active_upgrades = self.upgrades
            if active_upgrades and isinstance(active_upgrades, list):
                elements.append(Paragraph("03. Customized Project Deliverables", self.styles['SectionHeading']))
                deliverable_data = [["Deliverable", "Description"]]
                for feat in active_upgrades:
                    if isinstance(feat, dict):
                        item_name = feat.get("item", feat.get("title", "N/A"))
                        detail = feat.get("detail", feat.get("desc", ""))
                        deliverable_data.append([
                            Paragraph(f"<b>{item_name}</b>", self.styles['Normal']),
                            Paragraph(detail, self.styles['FooterText'])
                        ])
                
                del_table = Table(deliverable_data, colWidths=[2.5*inch, 4*inch])
                del_table.setStyle(TableStyle([
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f3f4f6')),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                elements.append(del_table)
                elements.append(Spacer(1, 0.2 * inch))

            elements.append(Paragraph("04. Financial Summary", self.styles['SectionHeading']))
            
            # Use total_cost as the final sum. Extract base_cost accordingly.
            final_total = self.payload.get("total_cost", 0)
            upgrades_cost = self.payload.get("upgrades_cost", 0) or 0
            base_cost = self.payload.get("base_cost") or (final_total - upgrades_cost)

            summary_data = [
                ["Base Construction Projection", self._format_currency(base_cost)],
            ]
            
            if upgrades_cost > 0:
                summary_data.append(["Premium Quality Upgrades", self._format_currency(upgrades_cost)])
                
            summary_data.append([Paragraph("<b>Final Turnkey Investment</b>", self.styles['Normal']), 
                                Paragraph(f"<b>{self._format_currency(final_total)}</b>", self.styles['Normal'])])

            summary_table = Table(summary_data, colWidths=[4.5*inch, 2*inch])
            summary_table.setStyle(TableStyle([
                ('LINEBELOW', (0,-2), (-1,-2), 0.5, colors.black),
                ('ALIGN', (1,0), (1,-1), 'RIGHT'),
                ('PADDING', (0,0), (-1,-1), 8),
                ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#eff6ff')),
            ]))
            elements.append(summary_table)
            elements.append(Spacer(1, 0.2 * inch))

            try:
                if self.explanation and isinstance(self.explanation, dict):
                    elements.append(Paragraph("05. Market Analysis & Narrative", self.styles['SectionHeading']))
                    for key in ["project_summary", "cost_distribution_explanation", "tier_upgrade_explanation", "final_summary_statement"]:
                        text = self.explanation.get(key)
                        if text:
                            elements.append(Paragraph(str(text), self.styles['Normal']))
                            elements.append(Spacer(1, 0.08 * inch))
                    elements.append(Spacer(1, 0.1 * inch))
            except Exception as e:
                print(f"Warning: Could not process explanation: {e}")

            elements.append(Paragraph("06. Authorization", self.styles['SectionHeading']))
            terms = [
                "Valid for 30 days from audit date.",
                "Based on 2026 Q1 Market Indices.",
                "Turnkey execution subject to site survey."
            ]
            for term in terms:
                elements.append(Paragraph(f"• {term}", self.styles['FooterText']))
            
            elements.append(Spacer(1, 0.2 * inch))

            sig_img = self._get_signature_image(self.payload.get("signature"))
            if sig_img:
                elements.append(Paragraph("<b>Digitally Signed:</b>", self.styles['Normal']))
                elements.append(Spacer(1, 0.05 * inch))
                elements.append(sig_img)
                elements.append(Paragraph("________________________", self.styles['Normal']))
                elements.append(Paragraph(self.payload.get('client_name', 'Abhishek'), self.styles['Normal']))
            else:
                elements.append(Paragraph("<b>Authorization:</b> Online verification pending signature.", self.styles['Normal']))

            doc.build(elements)
        except Exception as e:
            print(f"Critical error in PDF generation: {e}")
            import traceback
            traceback.print_exc()
            raise
