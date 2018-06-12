#include <eosiolib/eosio.hpp>

namespace tic_tac_toe {
   static const account_name games_account = N(games);
   static const account_name code_account = N(tic.tac.toe);
   
   
   //定义Game结构体
   /**
    * @brief Data structure to hold game information
    */
   static const uint32_t board_len = 9;
   struct game {
      game() {initialize_board();}
      game(account_name challenger, account_name host)
           : challenger(challenger), host(host), turn(host) {
         // 初始化游戏板
         initialize_board();
      }
      // challenger的账户名，也是表中的key
      account_name     challenger;
      // host的账户名
      account_name     host;
      // 轮到谁走, = 可能是host或challenger的账户名
      account_name     turn;
      // 赢家, = 空或平手或者是host或challenger的账户名
      account_name     winner = N(none);
      uint8_t          board[board_len]; 

      // Initialize board with empty cell
      void initialize_board() {
         for (uint8_t i = 0; i < board_len ; i++) {
            board[i] = 0;
         }
      }

      // Reset game
      void reset_game() {
         initialize_board();
         turn = host;
         winner = N(none);
      }

      auto primary_key() const { return challenger; }

      EOSLIB_SERIALIZE( game, (challenger)(host)(turn)(winner)(board) )
    };

   //创建游戏
   /**
    * @brief Action to create new game
    */
   struct create {
      account_name   challenger;
      account_name   host;

      EOSLIB_SERIALIZE( create, (challenger)(host) )
   };

   //重新开始游戏
   /**
    * @brief Action to restart new game
    */
   struct restart {
      account_name   challenger;
      account_name   host;
      account_name   by;

      EOSLIB_SERIALIZE( restart, (challenger)(host)(by) )
   };
   
   //关闭游戏
   /**
    * @brief Action to close new game
    */
   struct close {
      account_name   challenger;
      account_name   host;

      EOSLIB_SERIALIZE( close, (challenger)(host) )
   };

   //移动
   /**
    * @brief Data structure for movement
    */
   struct movement {
      uint32_t    row;
      uint32_t    column;

      EOSLIB_SERIALIZE( movement, (row)(column) )
   };

   /**
    * @brief Action to make movement
    */
   struct move {
      account_name   challenger;
      account_name   host;
      account_name   by; // the account who wants to make the move
      movement       mvt;

      EOSLIB_SERIALIZE( move, (challenger)(host)(by)(mvt) )
   };

   

    //定义一个 games 表
    /**
    * @brief table definition, used to store existing games and their current state
    */
    typedef eosio::multi_index<games_account, game> games;
}