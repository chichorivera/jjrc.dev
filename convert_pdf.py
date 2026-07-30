#!/usr/bin/env python3
from weasyprint import HTML
import os

# Ruta del archivo HTML
html_file = os.path.join(os.getcwd(), 'guia.html')
pdf_file = os.path.join(os.getcwd(), 'guia.pdf')

# Convertir HTML a PDF
HTML(html_file).write_pdf(pdf_file)

print(f"✓ PDF generado exitosamente: {pdf_file}")
