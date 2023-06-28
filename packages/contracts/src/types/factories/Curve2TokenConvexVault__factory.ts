/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  Curve2TokenConvexVault,
  Curve2TokenConvexVaultInterface,
  ConvexVaultDeploymentParamsStruct,
} from "../Curve2TokenConvexVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract NotionalProxy",
        name: "notional_",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "rewardPool",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint16",
                name: "primaryBorrowCurrencyId",
                type: "uint16",
              },
              {
                internalType: "address",
                name: "pool",
                type: "address",
              },
              {
                internalType: "contract ITradingModule",
                name: "tradingModule",
                type: "address",
              },
              {
                internalType: "bool",
                name: "isSelfLPToken",
                type: "bool",
              },
              {
                internalType: "uint32",
                name: "settlementPeriodInSeconds",
                type: "uint32",
              },
            ],
            internalType: "struct DeploymentParams",
            name: "baseParams",
            type: "tuple",
          },
        ],
        internalType: "struct ConvexVaultDeploymentParams",
        name: "params",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC20Error",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidEmergencySettlement",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "oraclePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "poolPrice",
        type: "uint256",
      },
    ],
    name: "InvalidPrice",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "InvalidPrimaryToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "InvalidSecondaryToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "totalPoolClaim",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "poolClaimThreshold",
        type: "uint256",
      },
    ],
    name: "PoolShareTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultNotLocked",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NOTIONAL",
    outputs: [
      {
        internalType: "contract NotionalProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRADING_MODULE",
    outputs: [
      {
        internalType: "contract ITradingModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewardTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "rewardTokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "claimedBalances",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolClaim",
        type: "uint256",
      },
    ],
    name: "convertPoolClaimToStrategyTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
    ],
    name: "convertStrategyToUnderlying",
    outputs: [
      {
        internalType: "int256",
        name: "underlyingValue",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyTokenAmount",
        type: "uint256",
      },
    ],
    name: "convertStrategyTokensToPoolClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "poolClaim",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "currencyIndex",
        type: "uint16",
      },
      {
        internalType: "int256",
        name: "depositUnderlyingInternal",
        type: "int256",
      },
    ],
    name: "deleverageAccount",
    outputs: [
      {
        internalType: "uint256",
        name: "vaultSharesFromLiquidation",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "depositAmountPrimeCash",
        type: "int256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "depositFromNotional",
    outputs: [
      {
        internalType: "uint256",
        name: "vaultSharesMinted",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
    ],
    name: "getEmergencySettlementPoolClaimAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "poolClaimToSettle",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRoles",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "normalSettlement",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "emergencySettlement",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "postMaturitySettlement",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "rewardReinvestment",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "staticSlippageTrading",
            type: "bytes32",
          },
        ],
        internalType: "struct IStrategyVault.StrategyVaultRoles",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenIndex",
        type: "uint256",
      },
    ],
    name: "getSpotPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "spotPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStrategyContext",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint32",
                name: "settlementPeriodInSeconds",
                type: "uint32",
              },
              {
                internalType: "contract ITradingModule",
                name: "tradingModule",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "maxUnderlyingSurplus",
                    type: "uint256",
                  },
                  {
                    internalType: "uint32",
                    name: "settlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "postMaturitySettlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "emergencySettlementSlippageLimitPercent",
                    type: "uint32",
                  },
                  {
                    internalType: "uint16",
                    name: "maxPoolShare",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "settlementCoolDownInMinutes",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "oraclePriceDeviationLimitPercent",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "poolSlippageLimitPercent",
                    type: "uint16",
                  },
                ],
                internalType: "struct StrategyVaultSettings",
                name: "vaultSettings",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "totalPoolClaim",
                    type: "uint256",
                  },
                  {
                    internalType: "uint80",
                    name: "totalVaultSharesGlobal",
                    type: "uint80",
                  },
                  {
                    internalType: "uint32",
                    name: "lastSettlementTimestamp",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "flags",
                    type: "uint32",
                  },
                ],
                internalType: "struct StrategyVaultState",
                name: "vaultState",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "poolClaimPrecision",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "canUseStaticSlippage",
                type: "bool",
              },
            ],
            internalType: "struct StrategyContext",
            name: "baseStrategy",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "primaryToken",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "secondaryToken",
                    type: "address",
                  },
                  {
                    internalType: "uint8",
                    name: "primaryIndex",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "secondaryIndex",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "primaryDecimals",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "secondaryDecimals",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256",
                    name: "primaryBalance",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "secondaryBalance",
                    type: "uint256",
                  },
                  {
                    internalType: "contract IERC20",
                    name: "poolToken",
                    type: "address",
                  },
                ],
                internalType: "struct TwoTokenPoolContext",
                name: "basePool",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "curvePool",
                type: "address",
              },
              {
                internalType: "bool",
                name: "isV2",
                type: "bool",
              },
            ],
            internalType: "struct Curve2TokenPoolContext",
            name: "poolContext",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "booster",
                type: "address",
              },
              {
                internalType: "address",
                name: "rewardPool",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                internalType: "contract IERC20[]",
                name: "rewardTokens",
                type: "address[]",
              },
            ],
            internalType: "struct ConvexStakingContext",
            name: "stakingContext",
            type: "tuple",
          },
        ],
        internalType: "struct Curve2TokenConvexStrategyContext",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint16",
            name: "borrowCurrencyId",
            type: "uint16",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "maxUnderlyingSurplus",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "settlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "postMaturitySettlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "emergencySettlementSlippageLimitPercent",
                type: "uint32",
              },
              {
                internalType: "uint16",
                name: "maxPoolShare",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "settlementCoolDownInMinutes",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "oraclePriceDeviationLimitPercent",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "poolSlippageLimitPercent",
                type: "uint16",
              },
            ],
            internalType: "struct StrategyVaultSettings",
            name: "settings",
            type: "tuple",
          },
        ],
        internalType: "struct InitParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "vaultShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "underlyingToRepayDebt",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "redeemFromNotional",
    outputs: [
      {
        internalType: "uint256",
        name: "transferToReceiver",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "tradeData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "minPoolClaim",
            type: "uint256",
          },
        ],
        internalType: "struct ReinvestRewardParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "reinvestReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "underlyingRequired",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "repaySecondaryBorrowCallback",
    outputs: [
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minPoolClaim",
        type: "uint256",
      },
    ],
    name: "restoreVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxUnderlyingSurplus",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "settlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "postMaturitySettlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "emergencySettlementSlippageLimitPercent",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxPoolShare",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "settlementCoolDownInMinutes",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "oraclePriceDeviationLimitPercent",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "poolSlippageLimitPercent",
            type: "uint16",
          },
        ],
        internalType: "struct StrategyVaultSettings",
        name: "settings",
        type: "tuple",
      },
    ],
    name: "setStrategyVaultSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maturity",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "settleVaultEmergency",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategy",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export class Curve2TokenConvexVault__factory {
  static readonly abi = _abi;
  static createInterface(): Curve2TokenConvexVaultInterface {
    return new utils.Interface(_abi) as Curve2TokenConvexVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Curve2TokenConvexVault {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as Curve2TokenConvexVault;
  }
}