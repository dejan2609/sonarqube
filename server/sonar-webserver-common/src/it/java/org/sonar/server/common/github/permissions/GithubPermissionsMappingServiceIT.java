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
package org.sonar.server.common.github.permissions;

import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.Rule;
import org.junit.Test;
import org.sonar.core.util.SequenceUuidFactory;
import org.sonar.core.util.UuidFactory;
import org.sonar.db.DbSession;
import org.sonar.db.DbTester;
import org.sonar.db.audit.AuditPersister;
import org.sonar.db.provisioning.GithubPermissionsMappingDao;
import org.sonar.db.provisioning.GithubPermissionsMappingDto;
import org.sonar.server.common.permission.Operation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.sonar.server.common.github.permissions.GithubPermissionsMappingService.ADMIN_GITHUB_ROLE;
import static org.sonar.server.common.github.permissions.GithubPermissionsMappingService.MAINTAIN_GITHUB_ROLE;
import static org.sonar.server.common.github.permissions.GithubPermissionsMappingService.READ_GITHUB_ROLE;
import static org.sonar.server.common.github.permissions.GithubPermissionsMappingService.TRIAGE_GITHUB_ROLE;
import static org.sonar.server.common.github.permissions.GithubPermissionsMappingService.WRITE_GITHUB_ROLE;

public class GithubPermissionsMappingServiceIT {

  private static final SonarqubePermissions NO_SQ_PERMISSIONS = new SonarqubePermissions(false, false, false, false, false, false);
  @Rule
  public DbTester db = DbTester.create();
  private final DbSession dbSession = db.getSession();

  private final AuditPersister auditPersister = mock();
  private final GithubPermissionsMappingDao githubPermissionsMappingDao = new GithubPermissionsMappingDao(auditPersister);

  private final UuidFactory uuidFactory = new SequenceUuidFactory();

  private final GithubPermissionsMappingService underTest = new GithubPermissionsMappingService(db.getDbClient(), githubPermissionsMappingDao, uuidFactory);

  @Test
  public void getPermissionsMapping_whenMappingNotDefined_returnMappingEntirelyFalse() {
    List<GithubPermissionsMapping> actualPermissionsMapping = underTest.getPermissionsMapping();

    List<GithubPermissionsMapping> expectedPermissionsMapping = List.of(
      new GithubPermissionsMapping(READ_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(TRIAGE_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(WRITE_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(MAINTAIN_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(ADMIN_GITHUB_ROLE, NO_SQ_PERMISSIONS));

    assertThat(actualPermissionsMapping).containsAll(expectedPermissionsMapping);
  }

  @Test
  public void getPermissionsMapping_whenMappingDefined_returnMapping() {
    Map<String, Set<String>> githubRolesToSqPermissions = Map.of(
      READ_GITHUB_ROLE, Set.of("user", "codeviewer"),
      WRITE_GITHUB_ROLE, Set.of("user", "codeviewer", "issueadmin", "securityhotspotadmin", "admin", "scan"));
    persistGithubPermissionsMapping(githubRolesToSqPermissions);

    List<GithubPermissionsMapping> actualPermissionsMapping = underTest.getPermissionsMapping();

    List<GithubPermissionsMapping> expectedPermissionsMapping = List.of(
      new GithubPermissionsMapping(READ_GITHUB_ROLE, new SonarqubePermissions(true, true, false, false, false, false)),
      new GithubPermissionsMapping(TRIAGE_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(WRITE_GITHUB_ROLE, new SonarqubePermissions(true, true, true, true, true, true)),
      new GithubPermissionsMapping(MAINTAIN_GITHUB_ROLE, NO_SQ_PERMISSIONS),
      new GithubPermissionsMapping(ADMIN_GITHUB_ROLE, NO_SQ_PERMISSIONS));

    assertThat(actualPermissionsMapping).containsAll(expectedPermissionsMapping);
  }

  private void persistGithubPermissionsMapping(Map<String, Set<String>> githubRolesToSonarqubePermissions) {
    for (Map.Entry<String, Set<String>> githubRoleToSonarqubePermissions : githubRolesToSonarqubePermissions.entrySet()) {
      String githubRole = githubRoleToSonarqubePermissions.getKey();
      githubRoleToSonarqubePermissions.getValue()
        .forEach(permission -> githubPermissionsMappingDao.insert(
          dbSession,
          new GithubPermissionsMappingDto("uuid_" + githubRole + "_" + permission, githubRole, permission)));
    }
    dbSession.commit();
  }

  @Test
  public void updatePermissionsMappings_shouldAddAndRemovePermissions() {
    Map<String, Set<String>> githubRolesToSqPermissions = Map.of(READ_GITHUB_ROLE, Set.of("user", "codeviewer"));
    persistGithubPermissionsMapping(githubRolesToSqPermissions);

    PermissionMappingChange permToAdd1 = new PermissionMappingChange(READ_GITHUB_ROLE, "issueadmin", Operation.ADD);
    PermissionMappingChange permToAdd2 = new PermissionMappingChange(READ_GITHUB_ROLE, "scan", Operation.ADD);
    PermissionMappingChange permToRemove1 = new PermissionMappingChange(READ_GITHUB_ROLE, "user", Operation.REMOVE);
    PermissionMappingChange permToRemove2 = new PermissionMappingChange(READ_GITHUB_ROLE, "codeviewer", Operation.REMOVE);

    underTest.updatePermissionsMappings(Set.of(permToAdd1, permToAdd2, permToRemove1, permToRemove2));

    GithubPermissionsMapping updatedPermissionsMapping = underTest.getPermissionsMappingForGithubRole(READ_GITHUB_ROLE);

    GithubPermissionsMapping expectedPermissionsMapping = new GithubPermissionsMapping(READ_GITHUB_ROLE, new SonarqubePermissions(false, false, true, false, false, true));
    assertThat(updatedPermissionsMapping).isEqualTo(expectedPermissionsMapping);
  }

  @Test
  public void updatePermissionsMappings_whenRemovingNonExistingPermission_isNoOp() {
    PermissionMappingChange permToRemove1 = new PermissionMappingChange(READ_GITHUB_ROLE, "user", Operation.REMOVE);

    underTest.updatePermissionsMappings(Set.of(permToRemove1));

    GithubPermissionsMapping updatedPermissionsMapping = underTest.getPermissionsMappingForGithubRole(READ_GITHUB_ROLE);

    GithubPermissionsMapping expectedPermissionsMapping = new GithubPermissionsMapping(READ_GITHUB_ROLE, NO_SQ_PERMISSIONS);
    assertThat(updatedPermissionsMapping).isEqualTo(expectedPermissionsMapping);
  }

  @Test
  public void updatePermissionsMappings_whenAddingAlreadyExistingPermission_isNoOp() {
    Map<String, Set<String>> githubRolesToSqPermissions = Map.of(READ_GITHUB_ROLE, Set.of("user", "codeviewer"));
    persistGithubPermissionsMapping(githubRolesToSqPermissions);
    PermissionMappingChange permToAdd1 = new PermissionMappingChange(READ_GITHUB_ROLE, "user", Operation.ADD);

    underTest.updatePermissionsMappings(Set.of(permToAdd1));

    GithubPermissionsMapping updatedPermissionsMapping = underTest.getPermissionsMappingForGithubRole(READ_GITHUB_ROLE);

    GithubPermissionsMapping expectedPermissionsMapping = new GithubPermissionsMapping(READ_GITHUB_ROLE, new SonarqubePermissions(true, true, false, false, false, false));
    assertThat(updatedPermissionsMapping).isEqualTo(expectedPermissionsMapping);
  }

  @Test
  public void updatePermissionsMappings_handlesUpdatesForDifferentRoles() {
    PermissionMappingChange permToAdd1 = new PermissionMappingChange(READ_GITHUB_ROLE, "user", Operation.ADD);
    PermissionMappingChange permToAdd2 = new PermissionMappingChange(WRITE_GITHUB_ROLE, "user", Operation.ADD);

    underTest.updatePermissionsMappings(Set.of(permToAdd1, permToAdd2));

    SonarqubePermissions userOnlySqPermission = new SonarqubePermissions(true, false, false, false, false, false);

    GithubPermissionsMapping updatedPermissionsMapping = underTest.getPermissionsMappingForGithubRole(READ_GITHUB_ROLE);
    assertThat(updatedPermissionsMapping).isEqualTo(new GithubPermissionsMapping(READ_GITHUB_ROLE, userOnlySqPermission));

    updatedPermissionsMapping = underTest.getPermissionsMappingForGithubRole(WRITE_GITHUB_ROLE);
    assertThat(updatedPermissionsMapping).isEqualTo(new GithubPermissionsMapping(WRITE_GITHUB_ROLE, userOnlySqPermission));
  }

  @Test
  public void getPermissionsMappingForGithubRole_shouldReturnMappingOnlyForRole() {
    Map<String, Set<String>> githubRolesToSqPermissions = Map.of(
      READ_GITHUB_ROLE, Set.of("user", "codeviewer"),
      WRITE_GITHUB_ROLE, Set.of("user", "codeviewer", "issueadmin", "securityhotspotadmin", "admin", "scan"));
    persistGithubPermissionsMapping(githubRolesToSqPermissions);

    GithubPermissionsMapping actualPermissionsMapping = underTest.getPermissionsMappingForGithubRole(READ_GITHUB_ROLE);

    GithubPermissionsMapping expectedPermissionsMapping = new GithubPermissionsMapping(READ_GITHUB_ROLE, new SonarqubePermissions(true, true, false, false, false, false));

    assertThat(actualPermissionsMapping).isEqualTo(expectedPermissionsMapping);
  }

}
