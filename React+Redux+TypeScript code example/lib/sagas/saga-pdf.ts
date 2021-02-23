import { ExportApi } from 'lib/api';
import { select, put, takeEvery, apply } from 'redux-saga/effects';
import { downloadBySimulatedClick } from 'lib/utils';
import {
  PDF_GENERATION_REQUEST, PDF_GENERATION_STARTED, PDF_GENERATION_FINISHED, OFFER_PDF_TEMPLATE,
  DRAFT_PDF_TEMPLATE
} from 'lib/actions';
import { IState } from 'lib/state';

const exportApi = new ExportApi();

function* sendPdfToRocketPdf(action) {
  let planId, rocketRequest, apiCall;

  switch (action.pdfTemplate) {
    case (DRAFT_PDF_TEMPLATE):
      planId = yield select((state: IState) => state.legacy.evaldraw.planId);
      const planId = yield select((state: IState) => state.ui.views.draft.activePlanId);
      const html = action.html;
      apiCall = exportApi.apiPlanByPlanIdExportDraftPdfByPlanIdPut;
      rocketRequest = {
        planId,
        planId,
        pdfData: {
          html: '<!DOCTYPE html>' + html,
          options: {
            UseLandscape: 'true',
            PageSize: 'Letter', // 8.5" x 11"
            Zoom: '1',
            DisableShrinking: 'true'
          }
        }
      };
      break;
    case (OFFER_PDF_TEMPLATE):
      planId = action.planId;
      const content = action.content;
      const header = action.header;
      apiCall = exportApi.apiPlanByPlanIdExportOfferPdfPut;
      rocketRequest = {
        planId,
        pdfData: {
          html: '<!DOCTYPE html>' + content,
          options: {
            UseLandscape: 'false',
            PageSize: 'Letter',
            Zoom: '1',
            DisableShrinking: 'true',
            MarginTop: '27',
            MarginLeft: '25',
            MarginRight: '10',
            MarginBottom: '15',
            FooterRight: 'Page [page] of [toPage]',
            FooterFontSize: '10',
            FooterSpacing: '4',
            HeaderSpacing: '18',
            HeaderHtml: '<!DOCTYPE html>' + header
          }
        }
      };
      break;

  }

  try {
    yield put({ type: PDF_GENERATION_STARTED });
    const response = yield apply(exportApi, apiCall, [rocketRequest]);
    yield put({ type: PDF_GENERATION_FINISHED });
    downloadBySimulatedClick(response.url);
  } catch (error) {
    yield put({ type: PDF_GENERATION_FINISHED, error });
    console.error('PDF generation error: ' + error);
  }
}

export function* pdfSaga() {
  yield takeEvery(PDF_GENERATION_REQUEST, sendPdfToRocketPdf);
}
