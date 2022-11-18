package web.rest.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/")
    public String startPage() {
        return "/login/index";
    }

    @GetMapping("/login")
    public String login() {
        return "/login/index";
    }
}
