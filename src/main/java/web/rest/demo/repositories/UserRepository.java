package web.rest.demo.repositories;


import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import web.rest.demo.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findUserByEmail(String Email);

    Optional<User> findUserByFirstName(String firstName);

    User findUserById(Long id);

}
