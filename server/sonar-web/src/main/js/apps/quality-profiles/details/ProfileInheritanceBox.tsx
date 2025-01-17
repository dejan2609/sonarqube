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
import { ContentCell, TableRow } from 'design-system';
import * as React from 'react';
import { translateWithParameters } from '../../../helpers/l10n';
import { ProfileInheritanceDetails } from '../../../types/types';
import BuiltInQualityProfileBadge from '../components/BuiltInQualityProfileBadge';
import ProfileLink from '../components/ProfileLink';

interface Props {
  className?: string;
  depth: number;
  displayLink?: boolean;
  language: string;
  profile: ProfileInheritanceDetails;
  type?: string;
}

export default function ProfileInheritanceBox(props: Props) {
  const { className, depth, language, profile, displayLink = true, type = 'current' } = props;
  const offset = 25 * depth;

  return (
    <TableRow className={classNames(`it__quality-profiles__inheritance-${type}`, className)}>
      <ContentCell>
        <div className="sw-flex sw-items-center sw-gap-2" style={{ paddingLeft: offset }}>
          {displayLink ? (
            <ProfileLink language={language} name={profile.name}>
              {profile.name}
            </ProfileLink>
          ) : (
            <span>{profile.name}</span>
          )}
          {profile.isBuiltIn && <BuiltInQualityProfileBadge />}
        </div>
      </ContentCell>

      <ContentCell>
        {translateWithParameters('quality_profile.x_active_rules', profile.activeRuleCount)}
      </ContentCell>

      <ContentCell>
        {profile.overridingRuleCount != null && (
          <p>
            {translateWithParameters(
              'quality_profiles.x_overridden_rules',
              profile.overridingRuleCount,
            )}
          </p>
        )}
      </ContentCell>
    </TableRow>
  );
}
