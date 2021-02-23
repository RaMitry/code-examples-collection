import * as React from 'react';

export const OFFER_PDF_TEMPLATE = 'offer';

export const PDF_GENERATION_REQUEST = 'pdfGenerationRequest';

export const generateAndDownloadPdfOffer = (content: string, header: string, planId?: number) => {
  return {
    type: PDF_GENERATION_REQUEST,
    pdfTemplate: OFFER_PDF_TEMPLATE,
    content,
    header,
    planId
  };
};
