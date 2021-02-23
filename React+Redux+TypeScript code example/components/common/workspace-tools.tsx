import * as React from 'react';
import { PlanPicker } from './plan-picker';
import { OpacityPicker } from './opacity-picker';
import { ScalePicker } from './scale-picker';
import * as _ from 'lodash';
import { IPlanModel } from 'lib/client-models';

export interface IWorkspaceToolsProps {
  opacity: number;
  scale: number;
  plans: IPlanModel[];
  activePlan?: IPlanModel;
}

export class WorkspaceTools extends React.PureComponent<IWorkspaceToolsProps, {}> {
  shouldComponentUpdate(newProps) {
    if (newProps.activePlan.id === this.props.activePlan.id && newProps.opacity === this.props.opacity && newProps.scale === this.props.scale && newProps.plans.length === this.props.plans.length) {
      return false;
    }
    return true;
  }

  splitPlansToFolders = (plans: IPlanModel[]) => {
    const planMapping = (p: IPlanModel) => { return { id: p.id, name: p.name };};

    let groups = _
      .chain(this.props.plans)
      .filter(p => (p.folder !== null))
      .groupBy(p => p.folder)
      .map((plans: IPlanModel[], folder: string, i) => {
        return {
          name: folder,
          initiallyOpen: true,
          items: plans.sort((a, b) => a.order - b.order).map(planMapping)
        };
      })
      .value()
      .sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'case'}));
    groups.push({ name: null, initiallyOpen: true, items: plans.filter(p => p.folder === null).map(planMapping)});
    groups.forEach((g, i) => g['id'] = i);
    return groups as any;
  }

  render() {
    const groups = this.splitPlansToFolders(this.props.plans);

    return (
      <div id="ec-draft-workspace-tools" className="aid-workspaceTools ec-draft-workspace-tools">
        <PlanPicker
          groups={groups}
          onChange={(draft) => { }}
          selectedItemId={this.props.activePlan.id} />
        <OpacityPicker selectedOpacity={this.props.opacity} />
        <ScalePicker currentScale={this.props.scale} />
      </div>
    );
  }
}
