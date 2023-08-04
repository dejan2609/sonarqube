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
/* eslint-disable react/no-unused-prop-types */
import {
  ButtonSecondary,
  DeferredSpinner,
  GreyCard,
  HelperHintIcon,
  LightPrimary,
  StandoutLink,
  TextMuted,
  Title,
} from 'design-system';
import * as React from 'react';
import withAppStateContext from '../../../app/components/app-state/withAppStateContext';
import HelpTooltip from '../../../components/controls/HelpTooltip';
import { translate } from '../../../helpers/l10n';
import { getBaseUrl } from '../../../helpers/system';
import { getCreateProjectModeLocation } from '../../../helpers/urls';
import { AlmKeys } from '../../../types/alm-settings';
import { AppState } from '../../../types/appstate';
import { CreateProjectModes } from './types';

export interface CreateProjectModeSelectionProps {
  almCounts: {
    [k in AlmKeys]: number;
  };
  appState: AppState;
  loadingBindings: boolean;
  onConfigMode: (mode: AlmKeys) => void;
}

function renderAlmOption(
  props: CreateProjectModeSelectionProps,
  alm: AlmKeys,
  mode: CreateProjectModes
) {
  const {
    almCounts,
    appState: { canAdmin },
    loadingBindings,
  } = props;
  const count = almCounts[alm];
  const hasConfig = count > 0;
  const disabled = loadingBindings || (!hasConfig && !canAdmin);
  const configMode = alm === AlmKeys.BitbucketCloud ? AlmKeys.BitbucketServer : alm;

  const svgFileName = alm === AlmKeys.BitbucketCloud ? AlmKeys.BitbucketServer : alm;
  const svgFileNameGrey = `${svgFileName}_grey`;

  const icon = (
    <img
      alt="" // Should be ignored by screen readers
      className="sw-h-4 sw-w-4"
      src={`${getBaseUrl()}/images/alm/${
        !disabled && hasConfig ? svgFileName : svgFileNameGrey
      }.svg`}
    />
  );

  return (
    <GreyCard className="sw-col-span-4 sw-p-4 sw-flex sw-justify-between sw-items-center">
      <div className="sw-items-center sw-flex sw-py-2">
        {!disabled && hasConfig ? (
          <StandoutLink icon={icon} to={getCreateProjectModeLocation(mode)}>
            {translate('onboarding.create_project.import_select_method', alm)}
          </StandoutLink>
        ) : (
          <>
            {icon}
            <TextMuted
              className="sw-ml-3 sw-text-sm sw-font-semibold"
              text={translate('onboarding.create_project.import_select_method', alm)}
            />
          </>
        )}
      </div>

      <DeferredSpinner loading={loadingBindings}>
        {!hasConfig &&
          (canAdmin ? (
            <ButtonSecondary onClick={() => props.onConfigMode(configMode)}>
              {translate('setup')}
            </ButtonSecondary>
          ) : (
            <HelpTooltip overlay={translate('onboarding.create_project.alm_not_configured')}>
              <HelperHintIcon aria-label="help-tooltip" />
            </HelpTooltip>
          ))}
      </DeferredSpinner>
    </GreyCard>
  );
}

export function CreateProjectModeSelection(props: CreateProjectModeSelectionProps) {
  const {
    appState: { canAdmin },
    almCounts,
  } = props;
  const almTotalCount = Object.values(almCounts).reduce((prev, cur) => prev + cur);

  return (
    <div className="sw-body-sm">
      <div className="sw-flex sw-flex-col">
        <Title className="sw-mb-10">{translate('onboarding.create_project.select_method')}</Title>
        <LightPrimary>
          {translate('onboarding.create_project.select_method.devops_platform')}
        </LightPrimary>
        <LightPrimary>
          {translate('onboarding.create_project.select_method.devops_platform_second')}
        </LightPrimary>
        {almTotalCount === 0 && canAdmin && (
          <LightPrimary className="sw-mt-3">
            {translate('onboarding.create_project.select_method.no_alm_yet.admin')}
          </LightPrimary>
        )}
        <div className="sw-grid sw-gap-x-12 sw-gap-y-6 sw-grid-cols-12 sw-mt-6">
          {renderAlmOption(props, AlmKeys.Azure, CreateProjectModes.AzureDevOps)}
          {renderAlmOption(props, AlmKeys.BitbucketServer, CreateProjectModes.BitbucketServer)}
          {renderAlmOption(props, AlmKeys.BitbucketCloud, CreateProjectModes.BitbucketCloud)}
          {renderAlmOption(props, AlmKeys.GitHub, CreateProjectModes.GitHub)}
          {renderAlmOption(props, AlmKeys.GitLab, CreateProjectModes.GitLab)}
        </div>
        <LightPrimary className="sw-mb-6 sw-mt-10">
          {translate('onboarding.create_project.select_method.manually')}
        </LightPrimary>
        <div className="sw-grid sw-gap-6 sw-grid-cols-12">
          <GreyCard className="sw-col-span-4 sw-p-4 sw-py-6 sw-flex sw-justify-between sw-items-center">
            <div>
              <StandoutLink to={getCreateProjectModeLocation(CreateProjectModes.Manual)}>
                {translate('onboarding.create_project.import_select_method.manual')}
              </StandoutLink>
            </div>
          </GreyCard>
        </div>
      </div>
    </div>
  );
}

export default withAppStateContext(CreateProjectModeSelection);
