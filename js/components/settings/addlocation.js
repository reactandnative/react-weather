/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  ListView
} from 'react-native';

import { connect } from 'react-redux';

import defaultStyles from './styles';
import { searchPostcodes, clearPostcodes } from '../../actions/postcode';
import type { Postcode } from '../../models/view';

import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  postcodes: Array<Postcode>;
  dispatch: any;
};

type State = {
  isSearchActive: bool;
  postcodeDataSource: any;
};

class AddLocation extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      isSearchActive: false,
      postcodeDataSource: this.cloneWithData(dataSource, props.postcodes)
    };

    (this: any).onSearchBarPressed = this.onSearchBarPressed.bind(this);
    (this: any).onSearchBarCancelPressed = this.onSearchBarCancelPressed.bind(this);
    (this: any).onSearchTextChange = this.onSearchTextChange.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.postcodes !== nextProps.postcodes) {
      this.setState({
        postcodeDataSource: this.cloneWithData(
          this.state.postcodeDataSource,
          nextProps.postcodes
        )
      });
    }
  }

  render() {
    var iconStyle = {};
    var textInputStyle = {width: 56};
    var isTextInputEditable = false;
    var cancelTouchableStyle = {width: 0, height: 0};
    var postcodeListView;

    if (this.state.isSearchActive) {
      iconStyle = {marginLeft: 8};
      textInputStyle = {flex: 1};
      isTextInputEditable = true;
      cancelTouchableStyle = {marginLeft: 8};

      postcodeListView = (
        <ListView
          enableEmptySections={true}
          dataSource={this.state.postcodeDataSource}
          renderRow={(row) => {
            return (
              <View style={defaultStyles.section}>
                <View style={defaultStyles.navigationButtonRow}>
                  <View style={defaultStyles.navigationButtonView}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={defaultStyles.navigationButtonText}>{ row.name }</Text>
                      <Text style={[defaultStyles.navigationButtonText, {paddingLeft: 8, color: '#C9C9CE'}]}>{ row.postcode }</Text>
                    </View>
                    <Text style={[defaultStyles.navigationButtonText, {color: '#C9C9CE'}]}>{ row.state }</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TouchableHighlight style={styles.searchBarTouchable} onPress={this.onSearchBarPressed} underlayColor='transparent'>
            <View style={styles.searchInnerView}>
              <Icon style={iconStyle} name='ios-search' size={16} color='#8E8E94' />
              <TextInput ref='searchTextInput' style={[textInputStyle, styles.searchBarTextInput]} editable={isTextInputEditable} placeholder='Search' placeholderTextColor='#8E8E94' onChangeText={this.onSearchTextChange}></TextInput>
            </View>
          </TouchableHighlight>
          <TouchableOpacity style={[cancelTouchableStyle, styles.searchBarCancelTouchable]} onPress={this.onSearchBarCancelPressed}>
            <Text style={styles.searchBarCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        { postcodeListView }
      </View>
    );
  }

  onSearchTextChange(text: string) {
    if (text.length >= 3) {
      this.props.dispatch(searchPostcodes(text));
    }
  }

  onSearchBarPressed() {
    LayoutAnimation.spring();
    this.setState({
      isSearchActive: true
    });
    this.refs.searchTextInput.focus();
  }

  onSearchBarCancelPressed() {
    LayoutAnimation.spring();
    this.setState({
      isSearchActive: false
    });
    this.refs.searchTextInput.clear();
    this.props.dispatch(clearPostcodes());
  }

  cloneWithData(dataSource: ListView.DataSource, data: any) {
    if (!data) {
      return dataSource.cloneWithRows([]);
    }

    if (Array.isArray(data)) {
      return dataSource.cloneWithRows(data);
    }

    return dataSource.cloneWithRowsAndSections(data);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
    marginTop: 64,
  },
  searchView: {
    backgroundColor: '#C9C9CE',
    height: 44,
    padding: 8,
    flexDirection: 'row'
  },
  searchInnerView: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarTouchable: {
    flex: 1
  },
  searchBarTextInput: {
    marginLeft: 8,
    fontSize: 14
  },
  searchBarCancelTouchable: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  searchBarCancelText: {
    color: '#0078FF',
    fontSize: 16
  }
});

function select(store: any, props: Props): Props {
  return {
    postcodes: store.postcode.data,
    ...props
  };
}

module.exports = connect(select)(AddLocation);
