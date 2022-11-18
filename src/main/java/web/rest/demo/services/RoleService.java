package web.rest.demo.services;

import web.rest.demo.models.Role;

import java.util.List;

public interface RoleService {

    void addRole(Role role);

    Role findByRole(String role);

    List<Role> listRoles();
}
