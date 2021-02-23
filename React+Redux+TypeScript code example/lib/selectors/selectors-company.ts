import { IState } from 'lib/state';


export const companySelector = (state: IState) => state.backend.company.company;
