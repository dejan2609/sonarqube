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
import { shallow } from 'enzyme';
import * as React from 'react';
import DonutChart, { DonutChartProps } from '../DonutChart';

it('should render correctly', () => {
  const wrapper = shallowRender();
  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find('Sector').first().dive()).toMatchSnapshot();
});

it('should render correctly with padding and pad angle too', () => {
  expect(shallowRender({ padAngle: 0.1, padding: [2, 2, 2, 2] })).toMatchSnapshot();
});

function shallowRender(props: Partial<DonutChartProps> = {}) {
  return shallow(
    <DonutChart
      data={[
        { fill: '#000000', value: 25 },
        { fill: '#ffffff', value: 75 },
      ]}
      height={20}
      thickness={2}
      width={20}
      {...props}
    />,
  );
}
