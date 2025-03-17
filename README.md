# Sentra Layer Sonic SVM smart contracts

## Development progress

### Core restaking

| **Core restaking features**  | **TO DO** | **In Progress** | PoC | **Refined** | **Audited** |
|------------------------------|-----------|-----------------|-----|-------------|-------------|
| Stake SOL                    |           | 🚧                |    |             |             |
| Restake LSTs                 |           | 🚧                |    |             |             |
| Delegate to operators        |           |                 | ✅   |             |             |
| Integrate Fungible Assets    |           |                 | ✅   |             |             |
| Queue withdrawals            |           |                 | ✅   |             |             |
| Complete queued withdrawals  |           |                 | ✅   |             |             |
| Slasher                      |           |                 | ✅   |             |             |
| Veto slashing                |           | 🚧               |     |             |             |
| Rewards Submission           |           |                 | ✅   |             |             |
| Rewards Distribution & Claim |           |                 | ✅   |             |             |
| Restake SOL                  | 📝         |                 |     |             |             |
| Customizable Slasher         |           | 🚧               |     |             |             |

### Middleware for AVS ZKbridge service

| **Core AVS features**             | **TO DO** | **In Progress** | PoC | **Refined** | **Audited** |
|-----------------------------------|-----------|-----------------|-----|-------------|-------------|
| BLS registry                      |           |                 | ✅   |             |             |
| Tasks submission                  |           |                 | ✅   |             |             |
| Tasks verification                |           |                 | ✅   |             |             |
| Mint bridged tokens               |           |                 | ✅   |             |             |
| AVS registry                      |           |                 | ✅   |             |             |
| Flexible Task verification logics |           | 🚧               |     |             |             |

## Contracts

### Sonic SVM Mainnet

// To be updated

### Sonic SVM Testnet

- 8mYkiWJF23Znv77Erfck3cQvUPqttdGPxu2FmBAsfBS

## Working flow

1. Restaking
![Restaking flow](https://cdn.dorahacks.io/static/files/19293a90d5ec0b9fedee70443dba7013.png)

2. AVSs
![AVS working flow](https://cdn.dorahacks.io/static/files/19293b860320354483b8890443c93a3f.png)
## Structure

### Main components

### States

#### StakePool

The `StakePool` struct is responsible for managing a collection of staked SOL tokens, tracking validator stakes, and handling user deposits and withdrawals. It interacts with Solana's staking program and uses various accounts to facilitate staking operations.

- `manager`: The public key of the stake pool's manager.

- `staker`: The public key of the staker responsible for managing stake delegation.

- `stake_deposit_authority`: The public key that authorizes stake deposits.

- `validator_list`: The public key of the validator list account tracking stake accounts.

- `reserve_stake`: The public key of the stake pool's reserve stake account.

- `pool_mint`: The public key of the pool token mint (represents ownership in the stake pool).

- `manager_fee_account`: The account receiving fees from staking rewards.

- `token_program_id`: The public key of the associated token program.

- `total_lamports`: Total lamports held in the stake pool.

- `pool_token_supply`: Total supply of stake pool tokens.

- `last_update_epoch`: The last epoch in which the stake pool was updated.

- `lockup`: The lockup configuration for the stake pool.

- `epoch_fee`: The fee taken by the pool at the end of each epoch.

- `next_epoch_fee`: The pending new fee for the next epoch (if updated).

- `preferred_deposit_validator`: An optional preferred validator for deposits.

- `preferred_withdraw_validator`: An optional preferred validator for withdrawals.

- `stake_deposit_fee`: Fee applied when depositing stake.

- `stake_withdrawal_fee`: Fee applied when withdrawing stake.

- `next_stake_withdrawal_fee`: A pending new fee for stake withdrawals.

- `stake_referral_fee`: A referral fee percentage for stake deposits.

- `sol_deposit_authority`: The authority for SOL deposits.

- `sol_deposit_fee`: Fee applied when depositing SOL.

- `sol_referral_fee`: A referral fee percentage for SOL deposits.

- `sol_withdraw_authority`: The authority for SOL withdrawals.

- `sol_withdrawal_fee`: Fee applied when withdrawing SOL.

- `next_sol_withdrawal_fee`: A pending new fee for SOL withdrawals.

- `last_epoch_pool_token_supply`: The supply of pool tokens in the last epoch.

- `last_epoch_total_lamports`: The total lamports in the last epoch.

#### Stake Pool Validation Functions

This document provides an overview of the key validation functions used in the Stake Pool program. These functions ensure the correctness and security of various accounts and authorities.

##### `check_manager_fee_info`
**Purpose:**
Validates that the manager fee account is a valid token program account capable of receiving tokens from the mint.

**Checks Performed:**
- The account belongs to the expected token program.
- The account is initialized.
- The mint associated with the account matches the pool’s mint.
- The account does not have unsupported extensions.

---

##### `check_authority_withdraw`
**Purpose:**
Verifies that the provided withdraw authority is correct.

**Checks Performed:**
- Uses `check_program_derived_authority` to validate if the withdraw authority is correctly derived.

---

##### `check_stake_deposit_authority`
**Purpose:**
Validates the stake deposit authority.

**Checks Performed:**
- Ensures the provided stake deposit authority matches the one stored in the pool.

---

##### `check_sol_deposit_authority`
**Purpose:**
Validates the SOL deposit authority if it is set.

**Checks Performed:**
- If a deposit authority exists, checks if the provided authority matches.
- Ensures the authority has signed the transaction.

---

##### `check_sol_withdraw_authority`
**Purpose:**
Validates the SOL withdraw authority if it is set.

**Checks Performed:**
- If a withdraw authority exists, checks if the provided authority matches.
- Ensures the authority has signed the transaction.

---

##### `check_mint`
**Purpose:**
Ensures that the provided mint account matches the pool mint.

**Checks Performed:**
- Compares the mint account’s key with the pool mint.
- Retrieves and returns the mint’s decimal precision.

---

##### `check_manager`
**Purpose:**
Validates the manager’s identity and signature.

**Checks Performed:**
- Ensures the provided manager matches the stored manager key.
- Verifies that the manager has signed the transaction.

---

##### `check_staker`
**Purpose:**
Validates the staker’s identity and signature.

**Checks Performed:**
- Ensures the provided staker matches the stored staker key.
- Verifies that the staker has signed the transaction.

#### Validator Stake Info

This section describes the `ValidatorList` struct, which is responsible for maintaining a list of validator stake accounts in the pool.

##### `ValidatorList`
**Purpose:**
The `ValidatorList` struct acts as a storage container for all validator stake accounts within the stake pool. It provides efficient access and management of validator-related staking data.

**Fields:**
- `header`: Stores metadata about the validator list. This is separated from the list itself to optimize deserialization performance.
- `validators`: A `Vec<ValidatorStakeInfo>` containing detailed staking information for each validator associated with the pool.

**Key Considerations:**
- The `ValidatorList` is designed to support efficient updates and queries, ensuring that validator stake accounts are managed effectively.
- Separating the `header` from the `validators` list reduces the computational overhead when processing the validator list.
- The structure supports serialization and deserialization via `Borsh`, allowing for efficient storage and retrieval of validator data.

#### Validator List Header

This section describes the `ValidatorListHeader` struct, which serves as a helper type to deserialize the beginning of a `ValidatorList`.

##### `ValidatorListHeader`
**Purpose:**
The `ValidatorListHeader` struct contains metadata for a `ValidatorList`, providing key details about the structure and constraints of the validator list.

**Fields:**
- `account_type`: Specifies the type of account. It must currently be set to `ValidatorList`.
- `max_validators`: Defines the maximum number of validator stake accounts that can be included in the `ValidatorList`.

**Key Considerations:**
- This struct enables quick deserialization of only the essential metadata without requiring full list deserialization.
- The `max_validators` field ensures that the stake pool adheres to predefined constraints on the number of validators.
- Supports `Borsh` serialization and deserialization for efficient data handling.

#### Validator Stake Info

This section describes the `ValidatorStakeInfo` struct, which contains information about a validator's stake in the pool.

##### `ValidatorStakeInfo`
**Purpose:**
The `ValidatorStakeInfo` struct stores essential details about a validator's stake, including active and transient stake amounts, status, and vote account address.

**Fields:**
- `active_stake_lamports`: The total amount of lamports in the validator's stake account, including rent. If `last_update_epoch` does not match the current epoch, this value may be outdated.
- `transient_stake_lamports`: The amount of transient stake delegated to this validator. This value may be inaccurate if `last_update_epoch` is outdated.
- `last_update_epoch`: The last epoch when `active_stake_lamports` and `transient_stake_lamports` were updated.
- `transient_seed_suffix`: A suffix used to derive the transient stake account address.
- `unused`: A reserved field, initially intended for specifying the end of seed suffixes.
- `validator_seed_suffix`: A seed suffix for the validator account. This is effectively `Option<NonZeroU32>`, where `0` represents `None`.
- `status`: The current status of the validator's stake account.
- `vote_account_address`: The validator's vote account address.

**Key Considerations:**
- The **order of fields** is critical for correct deserialization, as this struct is directly interpreted using `bytemuck` transmute.
- The structure is optimized for minimal BPF instructions by avoiding unnecessary alignment padding.
- Supports `Borsh` serialization and deserialization for efficient data handling.

#### Fee Structure

This section describes the `Fee` struct, which defines the fee rate as a ratio. The fee is minted on `UpdateStakePoolBalance` as a proportion of the rewards.

##### `Fee`
**Purpose:**
The `Fee` struct represents a fraction used to determine the fee amount based on the rewards generated in the stake pool.

**Fields:**
- `denominator`: The denominator of the fee ratio.
- `numerator`: The numerator of the fee ratio.

**Key Considerations:**
- If either the `numerator` or `denominator` is `0`, the fee is considered to be `0`.
- The fee is applied as a proportional value during the stake pool balance update process.
- Supports `Borsh` serialization and deserialization for efficient data handling.

### Instructions

#### `Initialize`
**Purpose:**
Initializes a new `StakePool`.

##### Accounts:
1. `[w]` **New StakePool** – The new stake pool to be created.
2. `[s]` **Manager** – The manager of the stake pool.
3. `[]` **Staker** – The staker responsible for managing validator stake accounts.
4. `[]` **Stake Pool Withdraw Authority** – The withdraw authority for the stake pool.
5. `[w]` **Validator Stake List Storage** – Uninitialized storage account for the validator stake list.
6. `[]` **Reserve Stake Account** – Must be initialized, have a zero balance, and have the staker/withdrawer authority set to the pool withdraw authority.
7. `[]` **Pool Token Mint** – Must have zero supply and be owned by the withdraw authority.
8. `[]` **Manager Fee Account** – Account to deposit the generated fee for the manager.
9. `[]` **Token Program ID** – The SPL Token program ID.
10. `[]` **(Optional) Deposit Authority** – Must sign all deposits if set. Defaults to the program address generated using `find_deposit_authority_program_address`, making deposits permissionless.

##### Parameters:
- `fee`: Fee assessed as a percentage of perceived rewards.
- `withdrawal_fee`: Fee charged per withdrawal as a percentage of the withdrawal amount.
- `deposit_fee`: Fee charged per deposit as a percentage of the deposit amount.
- `referral_fee`: Percentage (0-100) of `deposit_fee` allocated to the referrer.
- `max_validators`: Maximum expected number of validators.

**Key Considerations:**
- The stake pool must be properly initialized before any deposits or withdrawals can occur.
- Fees ensure proper distribution of rewards and facilitate referral incentives.
- The optional deposit authority allows for permissioned or permissionless deposits.

#### `AddValidatorToPool`
**Purpose:**  
Allows the staker to add a stake account delegated to a validator to the pool's list of managed validators.

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool to which the validator will be added.
2. `[s]` **Staker** – The authorized staker responsible for managing validators.
3. `[w]` **Reserve Stake Account** – Funds the new validator stake account.
4. `[]` **Stake Pool Withdraw Authority** – The withdraw authority of the stake pool.
5. `[w]` **Validator Stake List Storage Account** – Stores the list of validators in the stake pool.
6. `[w]` **Stake Account to Add** – The stake account that will be delegated to the validator.
7. `[]` **Validator Account** – The validator to which this stake account will be delegated.
8. `[]` **Rent Sysvar** – Provides rent exemption information.
9. `[]` **Clock Sysvar** – Provides the current epoch and time details.
10. `[]` **Stake History Sysvar** – Provides historical stake data.
11. `[]` **Stake Config Sysvar** – Contains stake configuration parameters.
12. `[]` **System Program** – Required for account management operations.
13. `[]` **Stake Program** – The program responsible for stake account operations.

##### Parameters:
- `u32` **Seed (Optional)** – A non-zero seed used for generating the validator stake address.

**Key Considerations:**
- The stake account will have a balance of the rent-exempt amount plus the maximum of:
  - `crate::MINIMUM_ACTIVE_STAKE`
  - `solana_program::stake::tools::get_minimum_delegation()`
- The stake account is funded from the stake pool reserve.
- Only the staker has the authority to add validators to the pool.

#### `RemoveValidatorFromPool`
**Purpose:**  
Allows the staker to remove a validator from the stake pool by deactivating its stake.

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool from which the validator is being removed.
2. `[s]` **Staker** – The authorized staker responsible for managing validators.
3. `[]` **Stake Pool Withdraw Authority** – The withdraw authority of the stake pool.
4. `[w]` **Validator Stake List Storage Account** – Stores the list of validators in the stake pool.
5. `[w]` **Stake Account to Remove** – The stake account associated with the validator being removed.
6. `[w]` **Transient Stake Account** – Used to deactivate the stake if necessary.
7. `[]` **Sysvar Clock** – Provides the current epoch and time details.
8. `[]` **Stake Program ID** – The program responsible for stake account operations.

**Key Considerations:**
- The instruction only succeeds if the validator stake account has at least the minimum balance of:
  - `max(crate::MINIMUM_ACTIVE_STAKE, solana_program::stake::tools::get_minimum_delegation())`
  - Plus the rent-exempt amount.
- If the validator has any remaining stake, it will first be moved to a transient stake account for deactivation.
- Only the staker has the authority to remove validators from the pool.

#### `DecreaseValidatorStake` (Deprecated)
**Purpose:**  
This instruction has been **deprecated** since version **0.7.0**.  
Use `DecreaseValidatorStakeWithReserve` instead.  

Allows the staker to decrease active stake on a validator by splitting the stake into a transient stake account and deactivating it.  

##### Accounts:
1. `[]` **Stake Pool** – The stake pool managing the validator.
2. `[s]` **Stake Pool Staker** – The staker authorized to manage validators.
3. `[]` **Stake Pool Withdraw Authority** – The withdraw authority of the stake pool.
4. `[w]` **Validator List** – Stores the list of validators in the stake pool.
5. `[w]` **Canonical Stake Account to Split From** – The active stake account from which stake will be split.
6. `[w]` **Transient Stake Account to Receive Split** – The temporary stake account that will receive the split stake.
7. `[]` **Clock Sysvar** – Provides the current epoch and time details.
8. `[]` **Rent Sysvar** – Provides rent exemption information.
9. `[]` **System Program** – Required for account management operations.
10. `[]` **Stake Program** – The program responsible for stake account operations.

##### Parameters:
- **`lamports: u64`** – The amount of lamports to split into the transient stake account.
- **`transient_stake_seed: u64`** – The seed used to create the transient stake account.

**Key Considerations:**
- The instruction only succeeds if the transient stake account **does not exist**.
- The amount of lamports to move must be at least:
  - Rent-exemption amount
  - Plus `max(crate::MINIMUM_ACTIVE_STAKE, solana_program::stake::tools::get_minimum_delegation())`
- This instruction helps rebalance the stake pool without the staker taking custody of funds.

#### `IncreaseValidatorStake`
**Purpose:**  
Allows the staker to increase the stake of a validator by splitting stake from the reserve stake account into a transient stake account and delegating it to the validator.  

##### Accounts:
1. `[]` **Stake Pool** – The stake pool managing the validator.
2. `[s]` **Stake Pool Staker** – The staker authorized to manage validators.
3. `[]` **Stake Pool Withdraw Authority** – The withdraw authority of the stake pool.
4. `[w]` **Validator List** – Stores the list of validators in the stake pool.
5. `[w]` **Stake Pool Reserve Stake** – The stake account holding unassigned stake.
6. `[w]` **Transient Stake Account** – A temporary stake account for transitioning stake.
7. `[]` **Validator Stake Account** – The active stake account for the validator.
8. `[]` **Validator Vote Account to Delegate To** – The validator's vote account.
9. `[]` **Clock Sysvar** – Provides the current epoch and time details.
10. `[]` **Rent Sysvar** – Provides rent exemption information.
11. `[]` **Stake History Sysvar** – Stores the historical stake values.
12. `[]` **Stake Config Sysvar** – Stores stake configuration parameters.
13. `[]` **System Program** – Required for account management operations.
14. `[]` **Stake Program** – The program responsible for stake account operations.

##### Parameters:
- **`lamports: u64`** – The amount of lamports to increase on the given validator.
- **`transient_stake_seed: u64`** – The seed used to create the transient stake account.

**Key Considerations:**
- The instruction only succeeds if the transient stake account **does not exist**.
- The minimum amount to move is:
  - Rent-exemption amount  
  - Plus `max(crate::MINIMUM_ACTIVE_STAKE, solana_program::stake::tools::get_minimum_delegation())`
- The actual amount split into the transient stake account is: lamports + stake_rent_exemption
- The rent-exemption amount of the stake account is withdrawn back to the reserve after it is merged.
- `UpdateValidatorListBalance` will merge the stake once it is ready.

#### `SetPreferredValidator`
**Purpose:**  
Allows the staker to set or unset a preferred validator for deposit or withdrawal operations in the stake pool.  
This helps prevent users from exploiting the pool as a free conversion service between SOL staked on different validators.

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool where the preferred validator setting applies.
2. `[s]` **Stake Pool Staker** – The authorized staker managing the pool settings.
3. `[]` **Validator List** – Stores the list of validators associated with the stake pool.

##### Parameters:
- **`validator_type: PreferredValidatorType`** – Specifies whether the setting applies to deposits or withdrawals.
- **`validator_vote_address: Option<Pubkey>`** – The validator's vote account that deposits or withdrawals must go through. If `None`, the preferred validator restriction is removed.

**Key Considerations:**
- The instruction **fails** if the specified validator is not part of the stake pool.
- By enforcing deposits and withdrawals through a specific validator, the pool avoids being used as a free SOL conversion mechanism.
- If `validator_vote_address` is `None`, any validator can be used for deposits and withdrawals.

#### `UpdateValidatorListBalance`
**Purpose:**  
Updates the balances of validator and transient stake accounts in the stake pool.  

This instruction processes each pair of validator and transient stake accounts, applying the following logic:
- If the **transient stake** is **inactive**, it is merged into the **reserve stake account**.
- If the **transient stake** is **active** and has **matching credits observed**, it is merged into the **canonical validator stake account**.
- In all other cases, no merging occurs, and the balance is simply added to the **canonical stake account balance**.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool where validator balances are updated.
2. `[]` **Stake Pool Withdraw Authority** – Authority to manage the stake pool.
3. `[w]` **Validator Stake List Storage Account** – Stores the list of validators and their associated stake accounts.
4. `[w]` **Reserve Stake Account** – Receives merged inactive transient stake.
5. `[]` **Sysvar Clock** – Provides the current cluster time.
6. `[]` **Sysvar Stake History** – Records the history of stake changes.
7. `[]` **Stake Program** – The Solana stake program.
8. `..7+2N` `[]` – **N pairs** of validator and transient stake accounts.

##### Parameters:
- **`start_index: u32`** – The index in the validator list to start updating from.
- **`no_merge: bool`** – If `true`, merging of transient stake accounts into the reserve or validator stake account is skipped.  
  - This can be useful for **testing** or if a **stake account is in an invalid state**, but balance updates are still required.

**Key Considerations:**
- Ensures stake pool balances remain accurate by synchronizing transient and validator stake accounts.
- Merging logic prevents unnecessary fragmentation of stake accounts.
- The `no_merge` flag allows selective updates without merging, useful for debugging or handling edge cases.

#### `UpdateStakePoolBalance`
**Purpose:**  
Updates the total stake pool balance by summing the balances of the **reserve stake account** and all **validator stake accounts**.

This ensures that the stake pool’s accounting remains accurate and reflects the true amount of stake under management.

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool whose balance needs updating.
2. `[]` **Stake Pool Withdraw Authority** – The authority managing withdrawals from the stake pool.
3. `[w]` **Validator Stake List Storage Account** – Stores the list of validators and their associated stake accounts.
4. `[]` **Reserve Stake Account** – The stake account holding unstaked or deactivated SOL.
5. `[w]` **Account to Receive Pool Fee Tokens** – The account designated to receive any fees collected by the stake pool.
6. `[w]` **Pool Mint Account** – The token mint for issuing new stake pool tokens.
7. `[]` **Pool Token Program** – The token program managing stake pool tokens.

##### Key Considerations:
- Ensures that the total stake pool balance remains **accurate**.
- Includes **stake from validators** and **reserve stake**.
- **Fees may be collected** and sent to the designated fee account.
- Stake pool tokens may be **minted** to reflect changes in the stake pool's value.

This instruction is crucial for maintaining correct accounting in the stake pool and ensuring that stake pool token holders receive accurate value.

#### `CleanupRemovedValidatorEntries`
**Purpose:**  
Removes validator stake account entries that are marked as **`ReadyForRemoval`** from the validator stake list. This helps maintain an optimized and clean validator list.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool from which validator entries will be removed.
2. `[w]` **Validator Stake List Storage Account** – Stores the list of validators and their associated stake accounts. This account will be modified to remove obsolete entries.

##### Key Considerations:
- Only **entries marked as `ReadyForRemoval`** will be deleted.
- Helps **optimize storage** by cleaning up outdated validator entries.
- Ensures the **validator stake list remains accurate** and up to date.
- This instruction does **not affect active validators**; only those explicitly flagged for removal will be deleted.

This is a **maintenance** instruction that keeps the stake pool's validator list efficient and free from unnecessary entries.

#### `DepositStake`
**Purpose:**  
Allows users to deposit **stake** into the stake pool. In return, they receive **pool tokens**, representing their proportional ownership in the pool. The deposited stake is merged with the appropriate validator stake account.

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool receiving the deposit.
2. `[w]` **Validator Stake List Storage Account** – Stores the list of validators and their stake accounts.
3. `[s]/[]` **Stake Pool Deposit Authority** – Must sign if the stake pool requires deposit authorization.
4. `[]` **Stake Pool Withdraw Authority** – Needed for stake merging operations.
5. `[w]` **Stake Account to Join the Pool** – The user’s stake account being deposited.
   - **Withdraw authority** for this stake account must first be set to the **stake pool deposit authority**.
6. `[w]` **Validator Stake Account** – The validator stake account where the deposit will be merged.
7. `[w]` **Reserve Stake Account** – Used to withdraw the **rent-exempt reserve** if necessary.
8. `[w]` **User Account to Receive Pool Tokens** – The user’s account where the corresponding pool tokens will be credited.
9. `[w]` **Pool Fee Token Account** – Receives a portion of the deposit as fees for the stake pool.
10. `[w]` **Referral Fee Token Account** – Optional account to receive a portion of the fees as a referral incentive.
11. `[w]` **Pool Token Mint Account** – Mints pool tokens to represent the deposited stake.
12. `[]` **Sysvar Clock Account** – Provides blockchain timestamping for transactions.
13. `[]` **Sysvar Stake History Account** – Provides information about historical stake operations.
14. `[]` **Pool Token Program ID** – Required for minting and transferring pool tokens.
15. `[]` **Stake Program ID** – Used for stake account management.

##### Key Considerations:
- The deposit converts **stake to pool tokens** based on the **current exchange rate**.
- The **stake account’s withdraw authority** must be assigned to the **stake pool deposit authority** before the deposit.
- A **fee** is deducted from the deposit and distributed between the stake pool and potential referral accounts.
- The deposited stake is merged into an **existing validator stake account**.

This instruction enables **users to contribute stake** to a pool and receive **liquid staked tokens** in return.

#### `WithdrawStake`
**Purpose:**  
Allows users to **withdraw stake** from the stake pool by burning **pool tokens** at the **current exchange rate**. The withdrawal succeeds if there is enough **SOL** in the stake account and the withdrawal does not drop the total staked amount below the **minimum active stake** requirement.

##### Accounts:
1. `[w]` **Stake Pool** – The pool from which stake is being withdrawn.
2. `[w]` **Validator Stake List Storage Account** – Stores the validator stake accounts in the pool.
3. `[]` **Stake Pool Withdraw Authority** – Must approve the withdrawal operation.
4. `[w]` **Validator or Reserve Stake Account to Split** – The stake account from which the withdrawal is processed.
5. `[w]` **Uninitialized Stake Account to Receive Withdrawal** – A new stake account that will receive the withdrawn stake.
6. `[]` **User Account to Set as New Withdraw Authority** – The account that will receive withdraw authority over the new stake account.
7. `[s]` **User Transfer Authority for Pool Token Account** – Signs for the burning of pool tokens.
8. `[w]` **User Account with Pool Tokens** – Holds the pool tokens to be burned in exchange for SOL.
9. `[w]` **Pool Fee Token Account** – Receives a portion of the withdrawal fee.
10. `[w]` **Pool Token Mint Account** – Pool tokens are burned from this mint.
11. `[]` **Sysvar Clock Account** – Provides blockchain timestamping.
12. `[]` **Pool Token Program ID** – Required for burning pool tokens.
13. `[]` **Stake Program ID** – Used for stake account management.

##### Withdrawal Priority:
Withdrawals follow a **priority order**:
1. **Preferred withdraw validator stake account** (if set).
2. **Validator stake accounts**.
3. **Transient stake accounts**.
4. **Reserve stake account** or **total removal of a validator stake account**.

##### Key Considerations:
- Users **burn pool tokens** in exchange for **staked SOL**.
- The stake **must remain above the minimum required amount** after withdrawal.
- If all validator stake accounts are at the minimum, the user can withdraw from **transient stake accounts**.
- If all transient stake accounts are at the minimum, the user can withdraw from the **reserve** or **remove a validator from the pool**.

This instruction enables users to **redeem their stake** from the pool efficiently while ensuring the pool remains operational.

#### `DepositSol`
**Purpose:**  
Allows users to **deposit SOL** directly into the **stake pool’s reserve account**. In return, they receive **pool tokens** representing their ownership in the pool. The deposit is converted based on the **current stake pool exchange rate**.

##### Accounts:
1. `[w]` **Stake Pool** – The pool receiving the SOL deposit.
2. `[]` **Stake Pool Withdraw Authority** – Required to approve deposits into the pool.
3. `[w]` **Reserve Stake Account** – The account where the deposited SOL is stored.
4. `[s]` **User Account Providing SOL** – The account sending SOL to the pool.
5. `[w]` **User Account to Receive Pool Tokens** – The recipient of the newly minted pool tokens.
6. `[w]` **Fee Token Account** – Receives a portion of the deposit as a fee.
7. `[w]` **Referral Fee Account** – Receives a portion of the fee as a referral bonus.
8. `[w]` **Pool Token Mint Account** – Used to mint the corresponding pool tokens.
9. `[]` **System Program Account** – Required to process the SOL deposit.
10. `[]` **Token Program ID** – Required to mint and transfer pool tokens.
11. `[s]` **(Optional) Stake Pool SOL Deposit Authority** – If present, it must authorize the deposit.

##### Key Considerations:
- Users deposit **SOL** into the **stake pool reserve**.
- In return, they receive **pool tokens** based on the **current exchange rate**.
- A **fee** is deducted from the deposit and split between the **fee token account** and the **referral fee account** (if applicable).
- If a **stake pool SOL deposit authority** is set, it must approve the deposit.

This instruction allows users to **participate in the stake pool** by directly contributing SOL and earning **stake pool rewards**.

#### `WithdrawSol`
**Purpose:**  
Allows users to **withdraw SOL** directly from the **stake pool’s reserve account** by burning their **pool tokens**. The transaction fails if there is **insufficient SOL in the reserve**.

##### Accounts:
1. `[w]` **Stake Pool** – The pool from which SOL is withdrawn.
2. `[]` **Stake Pool Withdraw Authority** – Must authorize the withdrawal.
3. `[s]` **User Transfer Authority** – Approves the burning of pool tokens.
4. `[w]` **User Account to Burn Pool Tokens** – The account holding the pool tokens that will be burned.
5. `[w]` **Reserve Stake Account** – The reserve account providing the SOL.
6. `[w]` **User Receiving SOL** – The system account receiving the withdrawn SOL.
7. `[w]` **Fee Token Account** – Receives a portion of the withdrawal as a fee.
8. `[w]` **Pool Token Mint Account** – The mint account for burning pool tokens.
9. `[]` **Clock Sysvar** – Required for timing-related operations.
10. `[]` **Stake History Sysvar** – Used for checking stake-related history.
11. `[]` **Stake Program Account** – Required for handling stake-related logic.
12. `[]` **Token Program ID** – Required for burning pool tokens.
13. `[s]` **(Optional) Stake Pool SOL Withdraw Authority** – If present, it must authorize the withdrawal.

##### Key Considerations:
- Users **burn pool tokens** in exchange for **SOL** at the **current exchange rate**.
- The transaction **fails** if there is **insufficient SOL** in the **reserve stake account**.
- A **fee** is deducted from the withdrawn amount and deposited into the **fee token account**.
- If a **stake pool SOL withdraw authority** is set, it must approve the transaction.

This instruction enables users to **exit the stake pool** by converting their **pool tokens back into SOL**, assuming there is enough liquidity in the reserve.

#### `CreateTokenMetadata`
**Purpose:**  
Creates **token metadata** for the **stake pool token** using the **Metaplex Token Metadata program**.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool for which metadata is created.
2. `[s]` **Manager** – The pool manager who authorizes the metadata creation.
3. `[]` **Stake Pool Withdraw Authority** – Needed to link metadata to the pool.
4. `[]` **Pool Token Mint Account** – The mint account of the pool token.
5. `[s, w]` **Payer** – Pays for the creation of the metadata account.
6. `[w]` **Token Metadata Account** – The account where the token metadata is stored.
7. `[]` **Metadata Program ID** – The Metaplex Token Metadata program.
8. `[]` **System Program ID** – Required for account creation.

##### Parameters:
- **`name: String`** – The full name of the stake pool token.
- **`symbol: String`** – A short symbol for the token (e.g., `stkSOL`).
- **`uri: String`** – The URI containing additional metadata for the token.

##### Key Considerations:
- The **manager** must sign the transaction to authorize metadata creation.
- The **payer** account covers the fees for metadata storage.
- This instruction **integrates** the stake pool token with the **Metaplex Metadata program**, allowing better compatibility with NFT marketplaces and wallets.
- The **URI** should point to a JSON file following the **Metaplex Token Metadata standard**.

This enables **better visibility and branding** for the stake pool token within the **Solana ecosystem**. 🚀

#### `UpdateTokenMetadata`
**Purpose:**  
Updates the **token metadata** for the **stake pool token** using the **Metaplex Token Metadata program**.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool whose token metadata is being updated.
2. `[s]` **Manager** – The pool manager who authorizes the metadata update.
3. `[]` **Stake Pool Withdraw Authority** – Needed for authorization.
4. `[w]` **Token Metadata Account** – The existing metadata account to be updated.
5. `[]` **Metadata Program ID** – The Metaplex Token Metadata program.

##### Parameters:
- **`name: String`** – The updated full name of the stake pool token.
- **`symbol: String`** – The updated short symbol for the token (e.g., `stkSOL`).
- **`uri: String`** – The updated URI containing additional metadata for the token.

##### Key Considerations:
- The **manager** must sign the transaction to authorize metadata updates.
- This instruction allows **rebranding** or updating metadata to reflect changes in the stake pool.
- The **URI** should point to a JSON file following the **Metaplex Token Metadata standard**.
- Ensures that wallets and marketplaces display **up-to-date** token information.

This keeps the **stake pool token metadata current** within the **Solana ecosystem**. 🚀

#### `IncreaseAdditionalValidatorStake`
**Purpose:**  
Allows the **staker** to **increase** stake on a validator **again within the same epoch**.  
This instruction ensures that **additional stake** can be delegated even if a **transient stake account** already exists.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool managing validator stakes.
2. `[s]` **Stake Pool Staker** – The authorized staker initiating the stake increase.
3. `[]` **Stake Pool Withdraw Authority** – Used for authorization.
4. `[w]` **Validator List** – The list tracking all validator stakes.
5. `[w]` **Stake Pool Reserve Stake** – The reserve stake account from which lamports are taken.
6. `[w]` **Uninitialized Ephemeral Stake Account** – Temporary account to receive the stake before delegation.
7. `[w]` **Transient Stake Account** – The existing transient stake account receiving the additional stake.
8. `[]` **Validator Stake Account** – The validator stake account where the stake will eventually be merged.
9. `[]` **Validator Vote Account** – The vote account for the validator being staked.
10. `[]` **Clock Sysvar** – Provides epoch timing information.
11. `[]` **Stake History Sysvar** – Contains staking history.
12. `[]` **Stake Config Sysvar** – Configuration settings for staking.
13. `[]` **System Program** – Required for account initialization.
14. `[]` **Stake Program** – Solana's built-in program for managing stake accounts.

##### Parameters:
- **`lamports: u64`** – The amount of SOL (in lamports) to increase on the given validator.
- **`transient_stake_seed: u64`** – Seed used to derive the transient stake account.
- **`ephemeral_stake_seed: u64`** – Seed used to derive the ephemeral stake account.

##### Key Considerations:
- This works **even if a transient stake account already exists**.
- Internally, this instruction:
  1. **Splits** stake from the **reserve stake** into an **ephemeral stake account**.
  2. **Activates** the stake.
  3. **Merges/Splits** it into the **transient stake account** for the validator.
- The **`UpdateValidatorListBalance`** instruction will later handle merging.
- The **minimum stake amount** includes rent-exemption plus a minimum required delegation.
- After merging, the **rent-exemption** amount is **withdrawn back** to the **reserve stake**.

This enables **dynamic staking adjustments** within the **same epoch** to maximize validator efficiency! 🚀

#### `DecreaseAdditionalValidatorStake`
**Purpose:**  
Allows the **staker** to **decrease active stake** from a **validator**, eventually moving it back to the **reserve stake account**.

##### Accounts:
1. `[]` **Stake Pool** –  
   - The **stake pool** managing the validator stakes.
2. `[s]` **Stake Pool Staker** –  
   - The **authorized staker** responsible for managing stake movements.
3. `[]` **Stake Pool Withdraw Authority** –  
   - Required to authorize stake withdrawals.
4. `[w]` **Validator List** –  
   - Stores details about **validators and their stake** allocations.
5. `[w]` **Reserve Stake Account** –  
   - Used to **fund** the ephemeral stake with a **rent-exempt reserve**.
6. `[w]` **Canonical Stake Account** –  
   - The validator **stake account** from which the stake will be **split**.
7. `[w]` **Uninitialized Ephemeral Stake Account** –  
   - Temporary account to receive the **split stake** before it’s deactivated.
8. `[w]` **Transient Stake Account** –  
   - Holds the **migrating stake** while it transitions to the **reserve**.
9. `[]` **Clock Sysvar** –  
   - Used to track **epoch progress** for stake deactivation.
10. `[]` **Stake History Sysvar** –  
    - Provides **stake activation history** for processing.
11. `[]` **System Program** –  
    - Required for account **creation and management**.
12. `[]` **Stake Program** –  
    - Used to handle **stake account operations**.

##### Parameters:
- **`lamports: u64`** – Amount of stake **to be split** into the transient stake account.
- **`transient_stake_seed: u64`** – Seed for **creating** the transient stake account.
- **`ephemeral_stake_seed: u64`** – Seed for **creating** the ephemeral stake account.

##### Key Considerations:
- Works **even if** a transient stake account **already exists**.
- Ensures **stake remains active** until it meets the **minimum delegation requirement**.
- Utilizes **ephemeral and transient stake accounts** to manage stake transitions.

This instruction helps in **optimizing stake allocations** and **gradually reducing validator stake**! ⚡📉  

#### `DecreaseValidatorStakeWithReserve`
**Purpose:**  
Allows the **staker** to **decrease active stake** on a validator,  
eventually **moving** the stake back to the **reserve**.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool managing validator stakes.
2. `[s]` **Stake Pool Staker** – The authorized staker initiating the stake decrease.
3. `[]` **Stake Pool Withdraw Authority** – Used for authorization.
4. `[w]` **Validator List** – The list tracking all validator stakes.
5. `[w]` **Reserve Stake Account** – The reserve stake account, used to fund rent-exempt reserve.
6. `[w]` **Canonical Stake Account** – The validator stake account from which the stake is being removed.
7. `[w]` **Transient Stake Account** – The transient stake account where the stake will be moved.
8. `[]` **Clock Sysvar** – Provides epoch timing information.
9. `[]` **Stake History Sysvar** – Contains staking history.
10. `[]` **System Program** – Required for account initialization.
11. `[]` **Stake Program** – Solana's built-in program for managing stake accounts.

##### Parameters:
- **`lamports: u64`** – The amount of SOL (in lamports) to split into the transient stake account.
- **`transient_stake_seed: u64`** – Seed used to derive the transient stake account.

##### Key Considerations:
- This **only succeeds** if the **transient stake account does not already exist**.
- Internally, this instruction:
  1. **Withdraws** enough lamports to make the **transient account rent-exempt**.
  2. **Splits** stake from the **canonical validator stake account** into the **transient stake account**.
  3. **Deactivates** the transient stake account.
- The **minimum stake amount** must be at least:
  - `max(crate::MINIMUM_ACTIVE_STAKE, solana_program::stake::tools::get_minimum_delegation())`
- Enables **rebalancing the pool** without taking direct custody of stake.

This is a crucial function for **efficient stake management** in a validator pool! 🔥⚡

#### `Redelegate` (Deprecated)
**Purpose:**  
Allows the **staker** to **redelegate active stake** from one validator  
to another within the **stake pool**, facilitating stake rebalancing  
**without taking custody** of the stake.

##### Accounts:
1. `[]` **Stake Pool** – The stake pool managing validator stakes.
2. `[s]` **Stake Pool Staker** – The authorized staker initiating redelegation.
3. `[]` **Stake Pool Withdraw Authority** – Used for authorization.
4. `[w]` **Validator List** – Tracks all validator stakes.
5. `[w]` **Reserve Stake Account** – Used to withdraw rent-exempt reserve.
6. `[w]` **Source Canonical Stake Account** – The validator stake account from which stake is being removed.
7. `[w]` **Source Transient Stake Account** – Receives split stake and is redelegated.
8. `[w]` **Uninitialized Ephemeral Stake Account** – Temporarily holds redelegated stake before merging.
9. `[w]` **Destination Transient Stake Account** – Receives ephemeral stake via merge.
10. `[]` **Destination Stake Account** – Receives transient stake after activation.
11. `[]` **Destination Validator Vote Account** – The vote account of the validator receiving stake.
12. `[]` **Clock Sysvar** – Provides epoch timing information.
13. `[]` **Stake History Sysvar** – Contains staking history.
14. `[]` **Stake Config Sysvar** – Contains staking configuration parameters.
15. `[]` **System Program** – Required for account initialization.
16. `[]` **Stake Program** – Solana's built-in program for managing stake accounts.

##### Parameters:
- **`lamports: u64`** – The amount of SOL (in lamports) to redelegate.
- **`source_transient_stake_seed: u64`** – Seed used to derive the **source transient stake account**.
- **`ephemeral_stake_seed: u64`** – Seed used to derive the **ephemeral stake account**.
- **`destination_transient_stake_seed: u64`** – Seed used to derive the **destination transient stake account**.  
  - If **transient stake already exists**, this **must match** the current seed.
  - If **no transient stake exists**, this can be **any value**.

##### Key Considerations:
- **Deprecated** since version **2.0.0** due to the redelegate instruction not being enabled.
- Internally, this instruction:
  1. **Splits** a **source validator stake account** into a **source transient stake account**.
  2. **Redelegates** stake from the **source transient account** to an **ephemeral stake account**.
  3. **Merges** the ephemeral stake account into the **destination transient stake account**.
  4. **Transfers** stake to the **destination validator** upon activation.
- **Fails if** the **source transient stake account** or **ephemeral stake account** already exists.
- The **minimum redelegation amount** must be at least:
  - `rent_exemption + minimum delegation`
- If the **destination transient stake account already exists**, the full **lamports amount** is redelegated.  
  Otherwise, the final amount is **`lamports - rent_exemption`**.

Although deprecated, this function provided a **critical stake rebalancing mechanism** in validator pools! ⚡🔥

#### `DepositStakeWithSlippage`
**Purpose:**  
Allows a **user** to deposit **stake** into a **stake pool** while ensuring  
they receive **at least** a **minimum amount of pool tokens**  
(based on a slippage constraint).

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool managing validator stakes.
2. `[w]` **Validator Stake List Storage Account** – Keeps track of all validators in the pool.
3. `[s]/[]` **Stake Pool Deposit Authority** – Required for authorization.
4. `[]` **Stake Pool Withdraw Authority** – Used for withdrawal operations.
5. `[w]` **Stake Account to Join the Pool** –  
   - The stake account being deposited.
   - Must have its **withdraw authority** set to the **stake pool deposit authority** before deposit.
6. `[w]` **Validator Stake Account** – The stake account in the pool that will be merged with the deposited stake.
7. `[w]` **Reserve Stake Account** – Holds reserve stake used for rent-exempt balance adjustments.
8. `[w]` **User Account to Receive Pool Tokens** –  
   - The account that receives **pool tokens** in exchange for deposited stake.
9. `[w]` **Account to Receive Pool Fee Tokens** – The pool's **fee account**.
10. `[w]` **Referral Fee Recipient** – Receives a **portion of the pool fees** (optional).
11. `[w]` **Pool Token Mint Account** – The mint for the **pool tokens** being distributed.
12. `[]` **Sysvar Clock Account** – Provides epoch timing information.
13. `[]` **Sysvar Stake History Account** – Contains past stake activation and deactivation data.
14. `[]` **Pool Token Program ID** – SPL Token program handling **pool tokens**.
15. `[]` **Stake Program ID** – Solana’s built-in **stake program**.

##### Parameters:
- **`minimum_pool_tokens_out: u64`** –  
  - The **minimum number of pool tokens** the user must receive.
  - Ensures **slippage protection**, preventing unfavorable conversion rates.

##### Key Considerations:
- The stake is deposited at the **current stake-to-pool token ratio**.
- Ensures the **minimum required pool tokens** are received, avoiding bad conversions.
- If **not enough pool tokens** can be provided, the **transaction fails** (slippage protection).
- Users receive **pool tokens**, which represent **ownership in the stake pool**.
- The **stake account being deposited** must be **delegated to a validator**  
  before it can be merged into the stake pool.

This function **enables controlled stake deposits** while protecting users  
from **unexpected slippage**! 🚀🔥

#### `WithdrawStakeWithSlippage`
**Purpose:**  
Allows a **user** to withdraw stake** from a **stake pool** by burning pool tokens,  
ensuring they receive **at least** a **minimum amount of lamports** (slippage protection).

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool managing validator stakes.
2. `[w]` **Validator Stake List Storage Account** – Tracks all validator stake accounts in the pool.
3. `[]` **Stake Pool Withdraw Authority** – Required to authorize stake withdrawals.
4. `[w]` **Validator or Reserve Stake Account to Split** –  
   - The stake account providing the withdrawn funds.
   - Can be either a **validator stake account** or the **reserve stake account**.
5. `[w]` **Uninitialized Stake Account to Receive Withdrawal** –  
   - The new stake account where withdrawn **SOL** will be placed.
6. `[]` **User Account to Set as New Withdraw Authority** –  
   - The user who will control the **new stake account**.
7. `[s]` **User Transfer Authority** –  
   - Required for transferring **pool tokens** from the user's account.
8. `[w]` **User Account with Pool Tokens to Burn From** –  
   - The user's account holding **stake pool tokens** (burned upon withdrawal).
9. `[w]` **Account to Receive Pool Fee Tokens** – The pool's **fee account**.
10. `[w]` **Pool Token Mint Account** – The mint for the **pool tokens** being burned.
11. `[]` **Sysvar Clock Account** – Provides epoch timing information.
12. `[]` **Pool Token Program ID** – SPL Token program handling **pool tokens**.
13. `[]` **Stake Program ID** – Solana’s built-in **stake program**.

##### Parameters:
- **`pool_tokens_in: u64`** –  
  - The **number of pool tokens** the user wants to burn.
  - Determines the **amount of lamports** received.
- **`minimum_lamports_out: u64`** –  
  - The **minimum amount of lamports** the user expects.
  - Prevents **slippage**, ensuring an acceptable conversion rate.

##### Key Considerations:
- The stake is **withdrawn at the current stake-to-pool token ratio**.
- Ensures the **minimum required lamports** are received, preventing bad conversions.
- If **not enough lamports** can be provided, the **transaction fails** (slippage protection).
- The **new stake account** must be **uninitialized** before withdrawal.
- Keeps **stake pool reserves** above **minimum rent-exempt thresholds**.
- Users **burn** pool tokens, reducing their share in the pool.

This function **allows controlled stake withdrawals** while protecting users  
from **unexpected slippage**! 🚀🔥

#### `DepositSolWithSlippage`
**Purpose:**  
Allows a **user** to deposit SOL** into a **stake pool's reserve**  
in exchange for **pool tokens**, ensuring a **minimum acceptable amount** of tokens is received (slippage protection).

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool managing SOL and validator stakes.
2. `[]` **Stake Pool Withdraw Authority** – Required for handling stake pool operations.
3. `[w]` **Reserve Stake Account** –  
   - The stake pool's **reserve** where deposited SOL will be stored.
4. `[s]` **Account Providing Lamports** –  
   - The **user's account** sending SOL to the stake pool.
5. `[w]` **User Account to Receive Pool Tokens** –  
   - The **user's SPL token account** that will receive **pool tokens**.
6. `[w]` **Account to Receive Fee Tokens** –  
   - The pool's **fee account** receiving its share of tokens.
7. `[w]` **Account to Receive Referral Fees** –  
   - A portion of pool fee tokens **can be distributed as referral fees**.
8. `[w]` **Pool Token Mint Account** –  
   - The **mint** for the stake pool's **SPL tokens**.
9. `[]` **System Program Account** – Required for transferring SOL.
10. `[]` **Token Program ID** – SPL Token program handling **pool tokens**.
11. `[s]` **(Optional) Stake Pool SOL Deposit Authority** –  
    - Required **if** the pool has a **special deposit authority**.

##### Parameters:
- **`lamports_in: u64`** –  
  - The **amount of SOL (in lamports)** the user wants to deposit.
- **`minimum_pool_tokens_out: u64`** –  
  - The **minimum amount of pool tokens** the user expects to receive.
  - Ensures **slippage protection**, preventing unfavorable deposit rates.

##### Key Considerations:
- Deposited **SOL** is added to the **stake pool reserve**.
- **Pool tokens** are minted and sent to the **user's account**.
- The user receives pool tokens **based on the current exchange rate**.
- If the **pool token output is below `minimum_pool_tokens_out`**, the **transaction fails**.
- A **fee** is taken from the deposit and distributed to the **fee account** and optional **referral account**.
- If a **special deposit authority** exists, it **must sign the transaction**.

This function **allows seamless SOL deposits** into a **stake pool**  
while ensuring users are protected from **unfavorable conversion rates**! 🚀🔄🔥

#### `WithdrawSolWithSlippage`
**Purpose:**  
Allows a **user** to withdraw SOL** from a **stake pool's reserve**,  
burning **pool tokens** in exchange while ensuring a **minimum acceptable amount** of SOL is received (slippage protection).

##### Accounts:
1. `[w]` **Stake Pool** – The stake pool managing SOL and validator stakes.
2. `[]` **Stake Pool Withdraw Authority** – Required for handling stake pool operations.
3. `[s]` **User Transfer Authority** –  
   - The **user's signing authority** for transferring **pool tokens**.
4. `[w]` **User Account to Burn Pool Tokens** –  
   - The **user's SPL token account** that will **burn pool tokens** in exchange for SOL.
5. `[w]` **Reserve Stake Account** –  
   - The **stake pool's reserve** from which SOL is withdrawn.
6. `[w]` **Account Receiving the Lamports** –  
   - The **user's system account** that will **receive SOL**.
7. `[w]` **Account to Receive Pool Fee Tokens** –  
   - The pool's **fee account** receiving a share of tokens.
8. `[w]` **Pool Token Mint Account** –  
   - The **mint** for the stake pool's **SPL tokens**.
9. `[]` **Clock Sysvar** – Required for tracking the current blockchain time.
10. `[]` **Stake History Sysvar** – Required for stake state validation.
11. `[]` **Stake Program Account** – Solana's **Stake Program**.
12. `[]` **Token Program ID** – SPL Token program handling **pool tokens**.
13. `[s]` **(Optional) Stake Pool SOL Withdraw Authority** –  
    - Required **if** the pool has a **special withdrawal authority**.

##### Parameters:
- **`pool_tokens_in: u64`** –  
  - The **amount of pool tokens** the user wants to burn.
- **`minimum_lamports_out: u64`** –  
  - The **minimum amount of SOL** the user expects to receive.
  - Ensures **slippage protection**, preventing **unfavorable withdrawal rates**.

##### Key Considerations:
- The **user burns pool tokens** in exchange for **SOL** from the **stake pool's reserve**.
- The user receives SOL **based on the current exchange rate**.
- If the **SOL received is below `minimum_lamports_out`**, the **transaction fails**.
- A **fee** is deducted from the withdrawal and distributed to the **fee account**.
- If a **special withdrawal authority** exists, it **must sign the transaction**.
- The withdrawal **fails** if the **reserve stake account lacks sufficient SOL**.

This function **allows seamless SOL withdrawals** from a **stake pool**  
while ensuring users are protected from **unfavorable conversion rates**! 🚀💰🔥

#### `SetManager`
**Purpose:**  
Allows the **current manager** of a **stake pool** to **transfer management rights** to a **new manager**.  

##### Accounts:
1. `[w]` **Stake Pool** –  
   - The **stake pool** whose manager is being updated.
2. `[s]` **Current Manager** –  
   - The **current** manager who is initiating the transfer.
3. `[s]` **New Manager** –  
   - The **new** manager receiving control over the stake pool.
4. `[]` **New Manager Fee Account** –  
   - The **fee account** associated with the **new manager**.

##### Key Considerations:
- Only the **current manager** can execute this instruction.
- The **new manager** must sign the transaction to accept the role.
- The **new manager fee account** is required to ensure proper **fee distribution**.
- After execution, the **new manager** gains full control over the stake pool.

This function allows **smooth managerial transitions** while maintaining **stake pool security**! 🔄🎯🔥

#### `SetFee`
**Purpose:**  
Allows the **stake pool manager** to **update** a specific **fee type** within the stake pool.  

##### Accounts:
1. `[w]` **Stake Pool** –  
   - The **stake pool** where the fee update will be applied.
2. `[s]` **Manager** –  
   - The **current** manager authorized to change the fee structure.

##### Parameters:
- `fee: FeeType` –  
  - The **type of fee** to update (e.g., **deposit fee, withdrawal fee, performance fee**).
  - The **new value** for the specified fee.

##### Key Considerations:
- Only the **current manager** has permission to modify fees.
- This update ensures that **stake pool fees** remain **adaptable** based on **market conditions**.
- Proper fee management **impacts user incentives** and **stake pool growth**.

This instruction provides **flexibility** in **fee adjustments** while maintaining **stake pool transparency**! 💰⚡

#### `SetStaker`
**Purpose:**  
Allows the **stake pool manager** or the **current staker** to **update** the **staker** for the stake pool.  

##### Accounts:
1. `[w]` **Stake Pool** –  
   - The **stake pool** where the staker update will be applied.
2. `[s]` **Manager or Current Staker** –  
   - Either the **manager** or the **current staker** is authorized to change the staker.
3. `[]` **New Staker Pubkey** –  
   - The **public key** of the **new staker**.

##### Key Considerations:
- The **staker** is responsible for **delegating stake** across validators.
- Only the **current manager** or **existing staker** can perform this update.
- Changing the staker enables **better delegation strategies** and **stake rebalancing**.

This instruction ensures **flexibility** in **stake delegation management**! 🔄💼  

#### `SetFundingAuthority`
**Purpose:**  
Allows the **stake pool manager** to **update** the **SOL deposit authority**, **stake deposit authority**, or **SOL withdrawal authority**.

##### Accounts:
1. `[w]` **Stake Pool** –  
   - The **stake pool** where the authority update will be applied.
2. `[s]` **Manager** –  
   - Only the **current stake pool manager** is authorized to change the funding authority.
3. `[]` **New Authority Pubkey (or None)** –  
   - The **public key** of the **new funding authority**, or `None` to remove the authority.

##### Parameters:
- `FundingType` – Specifies which **authority type** to update:
  - **SOL Deposit Authority** – Controls **who can deposit SOL** into the stake pool.
  - **Stake Deposit Authority** – Controls **who can deposit stake** into the pool.
  - **SOL Withdrawal Authority** – Controls **who can withdraw SOL** from the reserve.

##### Key Considerations:
- The **manager** can assign **specific roles** for different funding operations.
- Removing an authority (`None`) effectively **disables** the corresponding function.
- Helps in **restricting or delegating access** to pool operations.

This instruction ensures **granular access control** over funding operations! 🔑⚡  



