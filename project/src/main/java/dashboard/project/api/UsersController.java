package dashboard.project.api;

import dashboard.project.api.common.NotFoundException;
import dashboard.project.domain.AppUser;
import dashboard.project.repo.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {
  private final AppUserRepository repo;

  public UsersController(AppUserRepository repo) {
    this.repo = repo;
  }

  public record UpsertUserRequest(
    @NotBlank String initials,
    @NotBlank String name,
    @NotBlank @Email String email,
    AppUser.Role role,
    AppUser.Status status,
    Instant lastSeenAt
  ) {}

  @GetMapping
  public List<AppUser> list(@RequestParam(name = "q", required = false) String q) {
    String query = q == null ? "" : q.trim().toLowerCase();
    return repo.findAll().stream()
      .filter(u -> query.isEmpty()
        || u.getName().toLowerCase().contains(query)
        || u.getEmail().toLowerCase().contains(query)
        || (u.getRole() != null && u.getRole().name().toLowerCase().contains(query)))
      .sorted(Comparator.comparing(AppUser::getUpdatedAt).reversed())
      .toList();
  }

  @GetMapping("{id}")
  public AppUser get(@PathVariable UUID id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
  }

  @PostMapping
  public AppUser create(@Valid @RequestBody UpsertUserRequest body) {
    AppUser u = new AppUser();
    apply(u, body);
    return repo.save(u);
  }

  @PutMapping("{id}")
  public AppUser update(@PathVariable UUID id, @Valid @RequestBody UpsertUserRequest body) {
    AppUser u = repo.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    apply(u, body);
    return repo.save(u);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable UUID id) {
    AppUser u = repo.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    repo.delete(u);
  }

  private static void apply(AppUser u, UpsertUserRequest body) {
    u.setInitials(body.initials());
    u.setName(body.name());
    u.setEmail(body.email());
    u.setRole(body.role() == null ? AppUser.Role.OPS : body.role());
    u.setStatus(body.status() == null ? AppUser.Status.ACTIVE : body.status());
    u.setLastSeenAt(body.lastSeenAt());
  }
}

