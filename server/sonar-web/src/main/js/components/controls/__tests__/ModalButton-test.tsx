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
/* eslint-disable jsx-a11y/control-has-associated-label */

import { shallow } from 'enzyme';
import * as React from 'react';
import { click } from '../../../helpers/testUtils';
import ModalButton from '../ModalButton';

it('should open/close modal', () => {
  const wrapper = shallow(
    <ModalButton modal={({ onClose }) => <button id="js-close" onClick={onClose} type="button" />}>
      {({ onClick }) => <button id="js-open" onClick={onClick} type="button" />}
    </ModalButton>,
  );

  expect(wrapper.find('#js-open').exists()).toBe(true);
  expect(wrapper.find('#js-close').exists()).toBe(false);
  click(wrapper.find('#js-open'));
  expect(wrapper.find('#js-close').exists()).toBe(true);
  click(wrapper.find('#js-close'));
  expect(wrapper.find('#js-close').exists()).toBe(false);
});
