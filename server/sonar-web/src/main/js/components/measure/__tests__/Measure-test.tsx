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
import { MetricKey, MetricType } from '../../../types/metrics';
import Measure from '../Measure';

it('renders trivial measure', () => {
  expect(
    shallow(
      <Measure metricKey={MetricKey.coverage} metricType={MetricType.Percent} value="73.0" />,
    ),
  ).toMatchSnapshot();
});

it('renders leak measure', () => {
  expect(
    shallow(
      <Measure metricKey={MetricKey.new_coverage} metricType={MetricType.Percent} value="36.0" />,
    ),
  ).toMatchSnapshot();
});

it('renders LEVEL', () => {
  expect(
    shallow(
      <Measure metricKey="quality_gate_status" metricType={MetricType.Level} value="ERROR" />,
    ),
  ).toMatchSnapshot();
});

it('renders RATING', () => {
  expect(
    shallow(
      <Measure metricKey={MetricKey.sqale_rating} metricType={MetricType.Rating} value="3" />,
    ),
  ).toMatchSnapshot();
});

it('renders undefined measure', () => {
  expect(
    shallow(<Measure metricKey="foo" metricType={MetricType.Percent} value={undefined} />),
  ).toMatchSnapshot();
});
