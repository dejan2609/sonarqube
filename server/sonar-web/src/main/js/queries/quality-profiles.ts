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
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Profile, getProfileInheritance } from '../api/quality-profiles';
import { ProfileInheritanceDetails } from '../types/types';

export function useProfileInheritanceQuery(
  profile?: Pick<Profile, 'language' | 'name' | 'parentKey'>,
): UseQueryResult<{
  ancestors: ProfileInheritanceDetails[];
  children: ProfileInheritanceDetails[];
  profile: ProfileInheritanceDetails | null;
}> {
  const { language, name, parentKey } = profile ?? {};
  return useQuery({
    queryKey: ['quality-profiles', 'inheritance', language, name, parentKey],
    queryFn: async ({ queryKey: [, , language, name] }) => {
      if (!language || !name) {
        return { ancestors: [], children: [], profile: null };
      }
      const response = await getProfileInheritance({ language, name });
      response.ancestors.reverse();
      return response;
    },
  });
}
