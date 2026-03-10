package dashboard.project.repo;

import dashboard.project.domain.BankAccount;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountRepository extends JpaRepository<BankAccount, UUID> {}

