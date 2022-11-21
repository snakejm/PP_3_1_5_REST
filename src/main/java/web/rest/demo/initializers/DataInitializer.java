package web.rest.demo.initializers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import web.rest.demo.models.Role;
import web.rest.demo.models.User;
import web.rest.demo.services.RoleService;
import web.rest.demo.services.UserService;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class DataInitializer {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DataInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        Role roleAdmin = roleService.findByRole("ROLE_ADMIN");
        if (roleAdmin == null) {
            roleAdmin = new Role("ROLE_ADMIN");
            roleService.addRole(roleAdmin);
        }
        Role roleUser = roleService.findByRole("ROLE_USER");
        if (roleUser == null) {
            roleUser = new Role("ROLE_USER");
            roleService.addRole(roleUser);
        }

        User admin = userService.findUserByFirstName("admin");
        if (admin == null) {
            admin = new User("admin", "admin", 35, "admin", "admin@mail.ru",
                    List.of(roleAdmin, roleUser));
            userService.addUser(admin);
        }
        User user = userService.findUserByFirstName("user");
        if (user == null) {
            user = new User("user", "user", 30, "user", "user@mail.ru",
                    List.of(roleUser));
            userService.addUser(user);
        }

    }
}
