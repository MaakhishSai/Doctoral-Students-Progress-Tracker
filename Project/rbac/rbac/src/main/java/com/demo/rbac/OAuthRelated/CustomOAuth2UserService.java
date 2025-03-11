package com.demo.rbac.OAuthRelated;

import com.demo.rbac.model.User;
import com.demo.rbac.model.UserRole;
import com.demo.rbac.repository.UserRepository;
import com.demo.rbac.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Pattern;

//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.web.WebAttributes;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        System.out.println("Entering loadUser method...");
//
//        // Print the OAuth2UserRequest details
//        System.out.println("Client Registration ID: " + userRequest.getClientRegistration().getRegistrationId());
//        System.out.println("Access Token: " + userRequest.getAccessToken().getTokenValue());

        // Load the OAuth2User
        OAuth2User oAuth2User = super.loadUser(userRequest);
//        System.out.println("OAuth2User loaded successfully.");

        // Print OAuth2User attributes
//        System.out.println("OAuth2User Attributes: " + oAuth2User.getAttributes());

        try {
//            System.out.println("Processing OAuth2User...");
//            System.out.println("Maahi");
            // error is occuring here
            OAuth2User processedUser = processOAuth2User(oAuth2User);
//            System.out.println("OAuth2User processed successfully.");
            return processedUser;
        } catch (Exception ex) {
//            System.err.println("Error processing OAuth2User: " + ex.getMessage());
//            ex.printStackTrace(); // Print the full stack trace for debugging
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    // logic for logging in
    // checking the mail address
    private OAuth2User processOAuth2User(OAuth2User oAuth2User) {
//        System.out.println("Enter Process the user");
        String email = oAuth2User.getAttribute("email");
        System.out.println(email);
        // email is successfully obtained here
        // || !email.endsWith("@nitc.ac.in")
        if(email == null ) {
            System.out.println("Enter 1st if");
            throw new OAuth2AuthenticationException("Email Must be a Valid NITC Email Address");
        }
        System.out.println("Exit 1st if");
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()) {
            System.out.println("Enter 2nd if");
            // for first login my mail will get added in that set
            // and from later on we reach here since it isPresent()
            return new CustomUserDetails(userOptional.get(), oAuth2User.getAttributes());
        }
        else{
            // first during sign in we check if user is present
            // we enter else if user not present
            // we are entering here for my mail
            System.out.println("Enter else part");
            UserRole role = determineUserRole(email);
            System.out.println(role);
            // recognising my mail as student
            if(role == null) {
//                System.out.println("Did we enter here now");
                throw new OAuth2AuthenticationException("You are not authorized to access the website");
            }

            if(role == UserRole.COORDINATOR){
//                System.out.println("coordinator if");
                // Coordinators can directly register
                System.out.println("entered customauth service for coordinator login");
                throw new OAuth2AuthenticationException("Coordinators must log in using the form-based login.");
            }
            else{
//                System.out.println("student and supervisor if");
                // Students and supervisors need to be in the mapping sheet
                // we are coming here for my mail
                System.out.println(email);
                // mail is detected
                boolean isAuthorized = userService.isAuthorizedFromMapping(email, role);

                // added my mail in authorised students
                // now finally it's working
                // isAuthorized is true now
                if(!isAuthorized) {
//                    System.out.println("not authorized if");
                    // for my mail i am not authorized so exception is being generated
                    // breakpoint for my mail is here
                    throw new OAuth2AuthenticationException("You are not listed in the authenticated users list");
                }

                System.out.println("before user creation");

                // for all other than coordinator

                User user = userService.createUser(email, "1@234", role);
                System.out.println("before end of our function");
                return new CustomUserDetails(user, oAuth2User.getAttributes());
            }
        }
    }

    // since there can be only one coordinator
    // there will be only one coordinator email
//    private static final String COORDINATOR_EMAIL = "coordinator@nitc.ac.in";

    private UserRole determineUserRole(String email) {
        // Check if the email matches the fixed coordinator email
//        if (email.equalsIgnoreCase(COORDINATOR_EMAIL)) {
//            return UserRole.COORDINATOR;
//        }
// if (!email.endsWith("@nitc.ac.in")) {
//     return null; // ❌ Reject if email is not from nitc.ac.in
// }

        // Check if the email matches the PhD student pattern
        if (Pattern.compile("^[a-z]+_b\\d{6}[a-z]{2}@nitc\\.ac\\.in$").matcher(email).matches()) {
//            System.out.println("student mail matched");
            return UserRole.STUDENT;
        }

        // Check if the email matches the faculty pattern (Supervisors)
        // for my gmail to work giving in nitc.ac.in
        if (Pattern.compile("^[a-z0-9]+@gmail\\.com$").matcher(email).matches()) {
            return UserRole.SUPERVISOR;
        }

        // If no match, return null (or throw an exception if needed)
        return null;
    }

}
