package dashboard.project.repo;

import dashboard.project.domain.Recipient;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, UUID> {}

