#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

class todo_contract : public eosio::contract {
  public:
    todo_contract(account_name self)
      :eosio::contract(self),
      todos(_self, _self)
      {}

    // @abi action
    void create(account_name author, const uint32_t id, const std::string& description) {
      todos.emplace(author, [&](auto& new_todo) {
        new_todo.id  = id;
        new_todo.description = description;
        new_todo.completed = 0;
      });

      eosio::print("todo#", id, " created");
    }

    // @abi action
    void destroy(account_name author, const uint32_t id) {
      auto todo_lookup = todos.find(id);
      todos.erase(todo_lookup);

      eosio::print("todo#", id, " destroyed");
    }

    // @abi action
    void complete(account_name author, const uint32_t id) {
      auto todo_lookup = todos.find(id);
      eosio_assert(todo_lookup != todos.end(), "Todo does not exist");

      todos.modify(todo_lookup, author, [&](auto& modifiable_todo) {
        modifiable_todo.completed = 1;
      });

      eosio::print("todo#", id, " marked as complete");
    }

  private:
    // @abi table todos i64
    struct todo {
      uint64_t id;
      std::string description;
      uint64_t completed;

      uint64_t primary_key() const { return id; }
      EOSLIB_SERIALIZE(todo, (id)(description)(completed))
    };

    typedef eosio::multi_index<N(todos), todo> todo_table;
    todo_table todos;
};

EOSIO_ABI(todo_contract, (create)(complete)(destroy))