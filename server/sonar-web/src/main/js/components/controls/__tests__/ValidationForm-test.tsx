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
import ValidationForm from '../ValidationForm';

it('should render and submit', async () => {
  const render = jest.fn();
  const onSubmit = jest.fn().mockResolvedValue(null);
  const setSubmitting = jest.fn();
  const wrapper = shallow(
    <ValidationForm initialValues={{ foo: 'bar' }} onSubmit={onSubmit} validate={jest.fn()}>
      {render}
    </ValidationForm>,
  );
  expect(wrapper).toMatchSnapshot();
  wrapper.dive();
  expect(render).toHaveBeenCalledWith(
    expect.objectContaining({ dirty: false, errors: {}, values: { foo: 'bar' } }),
  );

  onSubmit.mockResolvedValue(undefined).mockClear();
  setSubmitting.mockClear();
  wrapper.prop<Function>('onSubmit')({ foo: 'bar' }, { setSubmitting });
  await new Promise(setImmediate);
  expect(setSubmitting).toHaveBeenCalledWith(false);
});
