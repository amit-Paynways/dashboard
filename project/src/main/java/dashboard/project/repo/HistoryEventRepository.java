package dashboard.project.repo;

import dashboard.project.domain.HistoryEvent;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryEventRepository extends JpaRepository<HistoryEvent, UUID> {}

