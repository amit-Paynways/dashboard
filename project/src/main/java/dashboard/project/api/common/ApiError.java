package dashboard.project.api.common;

import java.time.Instant;
import java.util.Map;

public record ApiError(
  Instant time,
  int status,
  String error,
  String message,
  String path,
  Map<String, Object> details
) {
  public static ApiError of(int status, String error, String message, String path, Map<String, Object> details) {
    return new ApiError(Instant.now(), status, error, message, path, details == null ? Map.of() : details);
  }
}

