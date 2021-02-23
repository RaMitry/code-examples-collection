import * as React from 'react';
import { Popover } from 'material-ui';
import { IDraft, DraftType, SymbolSize } from 'lib/interfaces';
import { IconButton, Divider, TextField, FlatButton, FontIcon, RaisedButton, AssemblyTemplate, RichDropDownMenuRowTemplate } from 'components/common';
import { LineWidthDropdown, SymbolSizeDropdown, DraftSymbolDropDown, DraftTypeDropDown, ColorPicker } from 'components/dropdowns';
import { style } from 'typestyle';
import { isLinearType } from 'lib/util';
import { DEFAULTS } from 'src/draft/legacy-constants';
import { UiBlocker, PartChooser } from 'components/containers/modals';
import { muiThemeable, MuiThemeProviderProps } from 'src/styles';
import { DetailedHeightInput } from 'components/common/detailed-height-input';
import { DEFAULT_DRAFT } from 'lib/constants';
import * as _ from 'lodash';
import { IAssemblyModel } from 'lib/client-models';
import { draftTypesDetails } from 'lib/utils';
import { connect } from 'react-redux';
import { formattedDraftLengthSelector } from 'lib/selectors/selectors-draft';

const colorPickerClassName = style({
  height: '41px'
});

const sectionClassName = style({
  margin: '20px'
});

const typeDetailClassName = style({
  width: '120px',
  flexGrow: 1,
  marginRight: '20px',
  marginTop: '10px'
});

const colorDetailClassName = style({
  width: '90px'
});

const contentWrapperClassName = style({
  display: 'flex',
  flexDirection: 'column',
  width: '350px'
});

interface IDraftDetailsPopoverOwnProps {
  draft: IDraft;
  anchorElement: React.ReactInstance;
  onChange?: (draft: IDraft) => void;
  onDelete?: () => void;
  onRequestClose: () => void;
}

interface IDraftDetailsPopoverStoreProps {
  formattedDraftLength: string;
}

interface IDraftDetailsPopoverState {
  editedName?: string;
  deleteRequested?: boolean;
  assemblyChangeRequested?: boolean;
}

type IDraftDetailsPopoverProps = IDraftDetailsPopoverOwnProps & IDraftDetailsPopoverStoreProps & MuiThemeProviderProps;

class DraftDetailsPopoverPure extends React.Component<IDraftDetailsPopoverProps, IDraftDetailsPopoverState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRequestDelete = (cancelRequest?: boolean) => {
    this.setState({
      deleteRequested: !cancelRequest
    });
  }

  handleInputKeypress = event => {
    if (event.key === 'Enter') {
      this.saveEditedName();
      event.target.blur();
    }
    if (event.key === 'Escape') {
      this.setEditedName(undefined);
      event.target.blur();
    }
  }

  setEditedName = (editedName: string) => this.setState({ editedName });

  saveEditedName = () => {
    if (this.state.editedName !== '') {
      this.onDraftChange({ ...this.props.draft, name: this.state.editedName });
      this.setEditedName(undefined);
    }
  }

  onDraftChange = (draft: IDraft) => {
    // This is custom fn which is supposed to merge
    // the properties of object unless they are null.
    // If user deletes a value in some property input
    // and closes the popout, we need to set that deleted
    // property value to default.
    const customizer = (objValue, srcValue) => {
      return (srcValue === null || _.isNaN(srcValue)) ? objValue : undefined;
    };
    const merged = _.mergeWith({}, DEFAULT_DRAFT, draft, customizer);
    this.props.onChange(merged);
  }

  onUpdateAssembly = (assembly: IAssemblyModel) => {
    this.onDraftChange({ ...this.props.draft, assembly });
    this.setState({ assemblyChangeRequested: false });
  }

  getLengthLabel() {
    switch (this.props.draft.type) {
      case DraftType.COUNT:
      case DraftType.LINEAR_EACH:
        return 'Resulting count';
      case DraftType.LINEAR:
      case DraftType.LINEAR_AVG_WITH_DROP:
      case DraftType.LINEAR_WITH_DROP:
        return 'Resulting length';
      case DraftType.AREA:
      default:
        return 'Result';
    }
  }

  getNameRow = () => {
    return (
      <div className={sectionClassName} style={{ marginBottom: '10px' }}>
        <div className="label" style={{ marginBottom: '-12px' }}>Take-off name</div>
        <TextField
          className="aid-renameTextField name"
          fullWidth
          onFocus={event => (event.target as any).select()}
          style={{ marginBottom: '', marginTop: '' }}
          errorText={this.state.editedName === '' && 'Please enter take-off name'}
          name="edit-name-input"
          value={this.state.editedName === undefined ? this.props.draft.name : this.state.editedName}
          onKeyDown={this.handleInputKeypress}
          onChange={(_, value) => this.setEditedName(value)}
        />
      </div>
    );
  }

  getAssemblyRow() {
    return (
      <div className={sectionClassName} style={{ marginTop: '10px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>Catalog Material</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <AssemblyTemplate assembly={this.props.draft.assembly} showParts style={{ maxWidth: '260px' }} />
          <IconButton
            icon="edit"
            iconStyle={{ color: this.props.muiTheme.palette.primary1Color }}
            style={{ padding: 0, height: undefined, marginLeft: '10px' }}
            onClick={() => this.setState({ assemblyChangeRequested: true })} />
        </div>
      </div>
    );
  }

  getTypeRow() {
    const typeDetails = draftTypesDetails[this.props.draft.type];
    return (
      <div className={sectionClassName} style={{ marginBottom: '12px', marginRight: 0 }}>

        <div style={{ marginRight: '20px' }}>
          <div className="label">Measurement type</div>
          <RichDropDownMenuRowTemplate title={typeDetails.name} icon={typeDetails.icon} description={typeDetails.description} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            (this.props.draft.type === DraftType.LINEAR_WITH_DROP || this.props.draft.type === DraftType.LINEAR_AVG_WITH_DROP) &&
            <div className={typeDetailClassName}>
              <div className="label">Drop Length</div>
              <TextField
                className="aid-dropLength"
                fullWidth
                name="dropLength"
                min={0}
                type="number"
                defaultValue={this.props.draft.dropLength}
                validator={(v) => (parseInt(v, 10) >= 0) ? null : 'Invalid Drop Length'}
                onChange={(e, value) => this.onDraftChange({ ...this.props.draft, dropLength: parseInt(value, 10) })}
              />
            </div>
          }

          {
            (this.props.draft.type === DraftType.LINEAR_WITH_DROP ||
              this.props.draft.type === DraftType.COUNT ||
              this.props.draft.type === DraftType.LINEAR_AVG_WITH_DROP ||
              this.props.draft.type === DraftType.LINEAR) &&
            <div className={typeDetailClassName}>
              <div className="label">Multiplier</div>
              <TextField
                className="aid-multiplier"
                fullWidth
                name="multiplier"
                min={1}
                step={1}
                type="number"
                defaultValue={this.props.draft.multiplier}
                validator={(v) => (parseInt(v, 10) > 0) ? null : 'Invalid Multiplier'}
                onChange={(_, value) => this.onDraftChange({ ...this.props.draft, multiplier: parseInt(value, 10) })}
              />
            </div>
          }

          {
            this.props.draft.type === DraftType.LINEAR_EACH &&
            <div className={typeDetailClassName}>
              <div className="label">Spacing</div>
              <TextField
                className="aid-spacing"
                fullWidth
                name="spacing"
                min={0}
                type="number"
                defaultValue={this.props.draft.spacing}
                validator={(v) => (parseInt(v, 10) > 0) ? null : 'Invalid Spacing'}
                onChange={(e, value) => this.onDraftChange({ ...this.props.draft, spacing: parseInt(value, 10) })}
              />
            </div>
          }

          {
            this.props.draft.type === DraftType.AREA &&
            <div className={typeDetailClassName} style={{ width: '170px' }}>
              <DetailedHeightInput
                height={this.props.draft.height}
                onChange={(value) => this.onDraftChange({ ...this.props.draft, height: value })}
              />
            </div>
          }

          <div className={typeDetailClassName} style={{ marginBottom: '-7px' }}>
            <div className="label">
              {this.getLengthLabel()}
            </div>
            <TextField
              className="aid-resultingCount"
              fullWidth
              inputStyle={{
                color: 'black',
                cursor: 'default'
              }}
              disabled={true}
              underlineShow={false}
              value={this.props.draft.length}
            />
          </div>
        </div>
      </div>
    );
  }

  getColorRow() {
    return (
      <div className={sectionClassName} style={{ display: 'flex' }}>
        {
          isLinearType(this.props.draft.type) &&
          <div className={colorDetailClassName}>
            <LineWidthDropdown
              value={this.props.draft.lineWidth || DEFAULTS.LINE_WIDTH}
              onChange={lineWidth => this.onDraftChange({ ...this.props.draft, lineWidth })} />
          </div>
        }
        {
          this.props.draft.type === DraftType.COUNT &&
          <div className={colorDetailClassName}>
            <DraftSymbolDropDown
              value={this.props.draft.symbol}
              onChange={symbol => this.onDraftChange({ ...this.props.draft, symbol })} />
          </div>
        }
        {
          this.props.draft.type === DraftType.COUNT &&
          <div className={colorDetailClassName}>
            <SymbolSizeDropdown
              value={this.props.draft.symbolSize || SymbolSize.Medium}
              onChange={symbolSize => this.onDraftChange({ ...this.props.draft, symbolSize })} />
          </div>
        }
        <div className={colorDetailClassName}>
          <ColorPicker onChange={color => this.onDraftChange({ ...this.props.draft, color })} color={this.props.draft.color}
            className={colorPickerClassName} />
        </div>
      </div>
    );
  }

  getPartChooser() {
    if (this.state.assemblyChangeRequested) {
      return (
        <PartChooser
          onCancel={() => this.setState({ assemblyChangeRequested: undefined })}
          onConfirm={this.onUpdateAssembly}
        />
      );
    }
  }

  // NOTE We need this popover to stay behind the PartChooser dialog, but the default MUI zIndex is higher than that of the dialog.
  // This can not be done by props so we are doing it here on DOM level
  componentDidMount() {
    const contentElement = document.querySelector('#draft-details').parentNode.parentNode.parentNode;
    contentElement.firstChild.parentElement.style.zIndex = '1310';
    const popoverElement = contentElement.parentElement;
    popoverElement.style.zIndex = '1300';
  }

  render() {
    return (
      <div>
        <Popover
          className="aid-popover-content"
          anchorEl={this.props.anchorElement}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          open={true}
          onRequestClose={this.props.onRequestClose}
        >
          <div className={contentWrapperClassName} id="draft-details">
            <div className="ec-draft-properties-menu-content" style={{ position: 'relative' }}>
              {this.getNameRow()}
              {this.getAssemblyRow()}
              <Divider />
              {this.getTypeRow()}
              <Divider />
              {this.getColorRow()}
              <Divider />
              {this.state.deleteRequested && <UiBlocker>Are you sure you want to delete this take-off?</UiBlocker>}
            </div>
            {this.props.onDelete && <div className={sectionClassName} style={{ justifyContent: 'space-between', display: 'flex' }}>
              {this.state.deleteRequested ?
                <div>
                  <FlatButton
                    className="aid-cancel"
                    primary
                    label="Cancel"
                    onClick={() => this.onRequestDelete(true)} />
                  <FlatButton
                    className="aid-confirm"
                    primary
                    icon={<FontIcon icon="delete" />}
                    label="Delete"
                    onClick={this.props.onDelete} />
                </div>
                : this.state.editedName !== undefined ?
                  [
                    <FlatButton
                      className="aid-cancel"
                      primary
                      key={1}
                      label="Cancel"
                      onClick={_ => this.setEditedName(undefined)} />,
                    <RaisedButton
                      className="aid-confirm"
                      primary
                      key={2}
                      disabled={this.state.editedName === ''}
                      label="Save"
                      onClick={this.saveEditedName} />
                  ]
                  :
                  [
                    <FlatButton
                      className="aid-delete"
                      primary
                      key={1}
                      icon={<FontIcon icon="delete" />}
                      label="Delete"
                      onClick={() => this.onRequestDelete()} />,
                    <FlatButton
                      className="aid-close"
                      key={2}
                      primary
                      label="Close"
                      onClick={this.props.onRequestClose} />
                  ]
              }
            </div>}
          </div>
        </Popover>
        {this.getPartChooser()}
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return {
    formattedDraftLength: formattedDraftLengthSelector(state, ownProps)
  };
};

export const DraftDetailsPopover = connect(mapState)(muiThemeable()(DraftDetailsPopoverPure));
