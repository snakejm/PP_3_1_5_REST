package web.rest.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import web.rest.demo.models.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRole(String role);
}
