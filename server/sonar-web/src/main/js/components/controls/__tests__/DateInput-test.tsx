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
import { addDays, subDays } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { parseDate } from '../../../helpers/dates';
import DateInput from '../DateInput';

beforeAll(() => {
  Date.prototype.getFullYear = jest.fn().mockReturnValue(2018); // eslint-disable-line no-extend-native
});

const dateA = parseDate('2018-01-17T00:00:00.000Z');
const dateB = parseDate('2018-02-05T00:00:00.000Z');

it('should render', () => {
  const { wrapper } = shallowRender();

  expect(wrapper).toMatchSnapshot();

  wrapper.setProps({ value: dateA });
  expect(wrapper).toMatchSnapshot();

  wrapper.setState({ open: true });
  expect(wrapper).toMatchSnapshot();
});

it('should select a day', () => {
  const onChange = jest.fn();
  const { wrapper, instance } = shallowRender({ onChange });
  wrapper.setState({ open: true });

  instance.handleDayClick(dateA, { disabled: true });
  expect(onChange).not.toHaveBeenCalled();
  expect(wrapper.state().open).toBe(true);

  instance.handleDayClick(dateA, {});
  expect(onChange).toHaveBeenLastCalledWith(dateA);
  wrapper.update();
  expect(wrapper.state().open).toBe(false);
  expect(wrapper).toMatchSnapshot();

  instance.handleResetClick();
  expect(onChange).toHaveBeenLastCalledWith(undefined);
});

it('should hightlightFrom range', () => {
  const { wrapper, instance } = shallowRender({ highlightFrom: dateA });
  wrapper.setState({ open: true });

  const dateC = addDays(dateA, 3);
  instance.handleDayMouseEnter(dateC, {});
  wrapper.update();
  const dayPicker = wrapper.find(DayPicker);
  expect(dayPicker.props().modifiers).toEqual({ highlighted: { from: dateA, to: dateC } });
});

it('should hightlightTo range', () => {
  const { wrapper, instance } = shallowRender({ highlightTo: dateB });
  wrapper.setState({ open: true });

  const dateC = subDays(dateB, 5);
  instance.handleDayMouseEnter(dateC, {});
  wrapper.update();
  const dayPicker = wrapper.find(DayPicker);
  expect(dayPicker.props().modifiers).toEqual({ highlighted: { from: dateC, to: dateB } });
});

function shallowRender(props?: Partial<DateInput['props']>) {
  const wrapper = shallow<DateInput>(
    <DateInput
      currentMonth={dateA}
      // pass `maxDate` and `minDate` to avoid differences in snapshots
      maxDate={dateB}
      minDate={dateA}
      onChange={jest.fn()}
      placeholder="placeholder"
      {...props}
    />,
  );
  const instance = wrapper.instance();
  return { wrapper, instance };
}
