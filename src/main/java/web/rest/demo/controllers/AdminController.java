package web.rest.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import web.rest.demo.models.User;
import web.rest.demo.services.RoleService;
import web.rest.demo.services.UserService;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String showAllUsers(Model model, Principal principal, @ModelAttribute("user") User user) {
        model.addAttribute("logout", userService.findUserByEmail(principal.getName()));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.listRoles());
        return "admin/index";
    }

    @DeleteMapping("/{id}")
    public String deleteUserById(@PathVariable("id") long id) {
        userService.deleteUserById(id);
        return "redirect:/admin";
    }

    @PostMapping("/new")
    public String create(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PatchMapping("/{id}/edit")
    public String update(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }
}
