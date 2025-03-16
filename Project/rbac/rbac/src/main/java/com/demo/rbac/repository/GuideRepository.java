package com.demo.rbac.repository;

import com.demo.rbac.model.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GuideRepository extends JpaRepository<Guide, Long> {
    Optional<Guide> findByEmail(String email);
}
