package dashboard.project.repo;

import dashboard.project.domain.DashboardReport;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<DashboardReport, UUID> {}

