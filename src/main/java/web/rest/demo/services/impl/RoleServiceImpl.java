package web.rest.demo.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.rest.demo.models.Role;
import web.rest.demo.repositories.RoleRepository;
import web.rest.demo.services.RoleService;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void addRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role findByRole(String role) {
        return roleRepository.findByRole(role).orElse(null);
    }

    @Override
    public List<Role> listRoles() {
        return roleRepository.findAll();
    }

}
