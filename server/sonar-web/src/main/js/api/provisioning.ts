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
import axios from 'axios';
import { throwGlobalError } from '../helpers/error';
import { getJSON, post, postJSON } from '../helpers/request';
import { GitHubConfigurationStatus, GitHubMapping, GithubStatus } from '../types/provisioning';

export function fetchIsScimEnabled(): Promise<boolean> {
  return getJSON('/api/scim_management/status')
    .then((r) => r.enabled)
    .catch(throwGlobalError);
}

export function activateScim(): Promise<void> {
  return post('/api/scim_management/enable').catch(throwGlobalError);
}

export function deactivateScim(): Promise<void> {
  return post('/api/scim_management/disable').catch(throwGlobalError);
}

export function fetchGithubProvisioningStatus(): Promise<GithubStatus> {
  return getJSON('/api/github_provisioning/status').catch(throwGlobalError);
}

export function activateGithubProvisioning(): Promise<void> {
  return post('/api/github_provisioning/enable').catch(throwGlobalError);
}

export function deactivateGithubProvisioning(): Promise<void> {
  return post('/api/github_provisioning/disable').catch(throwGlobalError);
}

export function checkConfigurationValidity(): Promise<GitHubConfigurationStatus> {
  return postJSON('/api/github_provisioning/check').catch(throwGlobalError);
}

export function syncNowGithubProvisioning(): Promise<void> {
  return post('/api/github_provisioning/sync').catch(throwGlobalError);
}

export function fetchGithubRolesMapping() {
  return axios
    .get<unknown, { githubPermissionsMappings: GitHubMapping[] }>(
      '/api/v2/github-permission-mappings',
    )
    .then((data) => data.githubPermissionsMappings);
}

export function updateGithubRolesMapping(
  role: string,
  data: Partial<Pick<GitHubMapping, 'permissions'>>,
): Promise<GitHubMapping> {
  return axios.patch(`/api/v2/github-permission-mappings/${role}`, data);
}
