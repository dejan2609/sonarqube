/*
 * SonarQube
 * Copyright (C) 2009-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import classNames from 'classnames';
import { orderBy, sortBy, without } from 'lodash';
import * as React from 'react';
import FacetBox from '../../../components/facet/FacetBox';
import FacetHeader from '../../../components/facet/FacetHeader';
import FacetItem from '../../../components/facet/FacetItem';
import FacetItemsList from '../../../components/facet/FacetItemsList';
import { translate } from '../../../helpers/l10n';
import { formatMeasure } from '../../../helpers/measures';
import { Dict } from '../../../types/types';
import { FacetKey } from '../query';

export interface BasicProps {
  onChange: (changes: Dict<string | string[] | undefined>) => void;
  onToggle: (facet: FacetKey) => void;
  open: boolean;
  stats?: Dict<number>;
  values: string[];
}

interface Props extends BasicProps {
  children?: React.ReactNode;
  disabled?: boolean;
  disabledHelper?: string;
  halfWidth?: boolean;
  options?: string[];
  property: FacetKey;
  renderFooter?: () => React.ReactNode;
  renderName?: (value: string) => React.ReactNode;
  renderTextName?: (value: string) => string;
  singleSelection?: boolean;
}

export default class Facet extends React.PureComponent<Props> {
  handleItemClick = (itemValue: string, multiple: boolean) => {
    const { values } = this.props;
    let newValue;
    if (this.props.singleSelection) {
      const value = values.length ? values[0] : undefined;
      newValue = itemValue === value ? undefined : itemValue;
    } else if (multiple) {
      newValue = orderBy(
        values.includes(itemValue) ? without(values, itemValue) : [...values, itemValue],
      );
    } else {
      newValue = values.includes(itemValue) && values.length < 2 ? [] : [itemValue];
    }
    this.props.onChange({ [this.props.property]: newValue });
  };

  handleHeaderClick = () => this.props.onToggle(this.props.property);

  handleClear = () => this.props.onChange({ [this.props.property]: [] });

  getStat = (value: string) => this.props.stats && this.props.stats[value];

  renderItem = (value: string) => {
    const active = this.props.values.includes(value);
    const stat = this.getStat(value);
    const { renderName = defaultRenderName, renderTextName = defaultRenderName } = this.props;

    return (
      <FacetItem
        active={active}
        halfWidth={this.props.halfWidth}
        key={value}
        name={renderName(value)}
        onClick={this.handleItemClick}
        stat={stat && formatMeasure(stat, 'SHORT_INT')}
        tooltip={renderTextName(value)}
        value={value}
      />
    );
  };

  render() {
    const {
      children,
      disabled,
      disabledHelper,
      open,
      property,
      renderTextName = defaultRenderName,
      stats,
    } = this.props;
    const values = this.props.values.map(renderTextName);
    const items =
      this.props.options ||
      (stats &&
        sortBy(
          Object.keys(stats),
          (key) => -stats[key],
          (key) => renderTextName(key).toLowerCase(),
        ));
    const headerId = `facet_${property}`;

    return (
      <FacetBox
        className={classNames({ 'search-navigator-facet-box-forbidden': disabled })}
        property={property}
      >
        <FacetHeader
          id={headerId}
          name={translate('coding_rules.facet', property)}
          disabled={disabled}
          disabledHelper={disabledHelper}
          onClear={this.handleClear}
          onClick={disabled ? undefined : this.handleHeaderClick}
          open={open && !disabled}
          values={values}
        >
          {children}
        </FacetHeader>

        {open && items !== undefined && (
          <FacetItemsList labelledby={headerId}>{items.map(this.renderItem)}</FacetItemsList>
        )}

        {open && this.props.renderFooter !== undefined && this.props.renderFooter()}
      </FacetBox>
    );
  }
}

function defaultRenderName(value: string) {
  return value;
}
