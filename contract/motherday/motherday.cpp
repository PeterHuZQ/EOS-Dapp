#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class motherday_contract : public eosio::contract {
  public:
      using eosio::contract::contract;
      void wish(account_name receiver) {
         eosio::print("Happy Mother's Day!");
      }
};

EOSIO_ABI( motherday_contract, (wish) )