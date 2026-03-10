package dashboard.project.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment extends AuditedEntity {
  public enum Flow { OUTWARD, INWARD }
  public enum Status { AWAITING_FUNDS, SETTLED, IN_TRANSIT, INFO_REQUESTED, REJECTED, EXPIRED }

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Column(unique = true)
  private String reference;

  @Enumerated(EnumType.STRING)
  private Flow flow;

  @NotBlank
  private String counterpartyName;

  private String counterpartyCountry;

  @NotBlank
  private String currency;

  @NotNull
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  private Status status;

  private String via;

  private Instant valueAt;

  public UUID getId() {
    return id;
  }

  public String getReference() {
    return reference;
  }

  public void setReference(String reference) {
    this.reference = reference;
  }

  public Flow getFlow() {
    return flow;
  }

  public void setFlow(Flow flow) {
    this.flow = flow;
  }

  public String getCounterpartyName() {
    return counterpartyName;
  }

  public void setCounterpartyName(String counterpartyName) {
    this.counterpartyName = counterpartyName;
  }

  public String getCounterpartyCountry() {
    return counterpartyCountry;
  }

  public void setCounterpartyCountry(String counterpartyCountry) {
    this.counterpartyCountry = counterpartyCountry;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public String getVia() {
    return via;
  }

  public void setVia(String via) {
    this.via = via;
  }

  public Instant getValueAt() {
    return valueAt;
  }

  public void setValueAt(Instant valueAt) {
    this.valueAt = valueAt;
  }
}

