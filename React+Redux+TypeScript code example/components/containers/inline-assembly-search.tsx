import * as React from 'react';
import { TextField, Popover, RefreshIndicator, AssemblyTemplate, MenuItem, RaisedButton, FontIcon } from 'components/common';
import { muiThemeable, MuiThemeProviderProps } from 'src/styles';
import { IAssemblyModel } from 'lib/client-models';
import { searchForAssemblies } from 'lib/utils/backend-requests';
import { delayedTrigger, cancelTrigger } from 'lib/utils';
import * as ReactDOM from 'react-dom';
import { Menu } from 'material-ui';
import { PartChooser } from 'components/containers/modals';

interface IInlineAssemblySearchState {
  queryString: string;
  searchResults?: IAssemblyModel[];
  waitingForResult?: boolean;
  catalogRequested?: boolean;
}

interface IInlineAssemblySearchProps extends MuiThemeProviderProps {
  onQueryUpdated?: (query: string) => void;
  onAssembliesChosen?: (assemblies: IAssemblyModel[]) => void;
}

class InlineAssemblySearchPure extends React.PureComponent<IInlineAssemblySearchProps, IInlineAssemblySearchState> {
  anchorRef;
  menuRef;
  textFieldRef;
  requestId = 0;

  constructor() {
    super();
    this.state = {
      queryString: ''
    };
  }

  onQueryStringUpdate = (queryString: string) => {
    this.setState({
      queryString,
      searchResults: undefined,
      waitingForResult: false
    });
    this.props.onQueryUpdated && this.props.onQueryUpdated(queryString);
    this.requestId++; // Invalidate pending search request
    delayedTrigger(this.triggerSearch);
  }

  triggerSearch = () => {
    if (this.state.queryString.trim().length < 3) {
      return;
    }
    const currentRequestId = this.requestId;
    searchForAssemblies(this.state.queryString.trim(), 5).then(queryResult => {
      if (currentRequestId === this.requestId) {
        this.processQueryResult(queryResult);
      }
    });
    this.setState({
      waitingForResult: true,
      searchResults: undefined
    });
  }

  processQueryResult = (queryResult) => {
    this.setState({
      waitingForResult: false,
      searchResults: (queryResult.result && queryResult.result.length > 0) ? queryResult.result : undefined
    });
  }

  onTextFieldKeyDown = event => {
    if (event.key === 'ArrowDown' && this.state.searchResults && this.menuRef) {
      this.menuRef.setFocusIndex(event, 0, true);
    }
    if (event.key === 'Tab') {
      cancelTrigger(this.triggerSearch);
      this.closePopover();
    }
  }

  // Material-ui dialog is handing key up event so we must too
  handleEscapeKey = event => {
    if (event.key === 'Escape') {
      if (this.state.waitingForResult || this.state.searchResults) {
        this.closePopover();
        this.textFieldRef.focus();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  closePopover = () => {
    this.setState({
      waitingForResult: false,
      searchResults: undefined
    });
    this.requestId++;

  selectAssembly = assembly => {
    this.props.onAssembliesChosen && this.props.onAssembliesChosen([assembly]);
  }

  render() {
    return (
      <div
        style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        className="aid-inlineAssemblySearch">
        <div ref={ref => this.anchorRef = ref} style={{ width: '100%' }}>
          <TextField
            className="aid-inlineAssemblySearchTextField"
            autoFocus
            fullWidth
            floatingLabelText="Material name"
            floatingLabelFixed
            ref={ref => this.textFieldRef = ref}
            onKeyDown={this.onTextFieldKeyDown}
            onKeyUp={this.handleEscapeKey}
            hintText="Type material name or pick one from catalog..."
            value={this.state.queryString}
            onChange={(unused, newValue) => this.onQueryStringUpdate(newValue)} />
        </div>
        <RaisedButton
          icon={<FontIcon icon="list" />}
          primary={!this.state.queryString}
          label="Catalog"
          onClick={() => this.setState({ catalogRequested: true })}
          labelColor={this.props.muiTheme.palette.primary1Color}
          style={{
            margin: '0 6px 10px 10px',
            minWidth: '125px',
            alignSelf: 'flex-end'
          }} />
        <Popover
          onClose={this.closePopover}
          anchor={this.anchorRef}
          hideOriginElement={true}
          open={!!this.state.searchResults || this.state.waitingForResult}>
          {this.state.searchResults ?
            <Menu disableAutoFocus={true} onEscKeyDown={() => { }} ref={ref => this.menuRef = ref}>
              {this.state.searchResults.map((assembly, index) =>
                <MenuItem
                  key={assembly.id}
                  onKeyUp={this.handleEscapeKey}
                  onClick={() => this.selectAssembly(assembly)}
                  onKeyDown={event => event.key === 'Enter' && this.selectAssembly(assembly)}
                  style={{ lineHeight: 'inherit' }}>
                  <AssemblyTemplate assembly={assembly} />
                </MenuItem>
              )}
            </Menu>
            : <div style={{ width: '392px', padding: '10px' }}><RefreshIndicator status="loading" left={0} top={0} /></div>}
        </Popover>
        {this.state.catalogRequested &&
          <PartChooser
            onCancel={() => this.setState({ catalogRequested: false })}
            onConfirm={this.selectAssembly} />}
      </div>
    );
  }
}

export const InlineAssemblySearch = muiThemeable()(InlineAssemblySearchPure);
