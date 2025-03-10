/*
 * SonarQube
 * Copyright (C) 2009-2025 SonarSource SA
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
package org.sonar.telemetry.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.UncheckedIOException;
import org.sonar.telemetry.core.schema.BaseMessage;

public class MessageSerializer {

  private MessageSerializer() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static String serialize(BaseMessage message) {
    ObjectMapper mapper = new ObjectMapper();
    try {
      return mapper.writeValueAsString(message);
    } catch (IOException ioException) {
      throw new UncheckedIOException(ioException);
    }
  }

}
