#include "tic_tac_toe.hpp"

using namespace eosio;
namespace tic_tac_toe {
    struct impl {

        // 1、创建游戏：
        // 确保该操作具有来自主机的签名
        // 确保挑战者和主持人不是同一个玩家
        // 确保没有现有的游戏
        // 将新创建的游戏存储到数据库中
        /**
        * @brief Apply create action
        * @param c - action to be applied
        */  
        void on(const create& c) {
            require_auth(c.host);
            eosio_assert(c.challenger != c.host, "challenger shouldn't be the same as host");

            // Check if game already exists
            games existing_host_games(code_account, c.host);
            auto itr = existing_host_games.find( c.challenger );
            eosio_assert(itr == existing_host_games.end(), "game already exists");

            existing_host_games.emplace(c.host, [&]( auto& g ) {
                g.challenger = c.challenger;
                g.host = c.host;
                g.turn = c.host;
            });
        }

        // 2、重启游戏
        // 确保该操作具有来自主持人/挑战者的签名
        // 确保游戏存在
        // 确保重新启动操作由主机/挑战者完成
        // 重置游戏
        // 将更新的游戏存储到数据库
        /**
        * @brief Apply restart action
        * @param r - action to be applied
        */
        void on(const restart& r){
            require_auth(r.by);

            // Check if game exists
            games existing_host_games(code_account, r.host);
            auto itr = existing_host_games.find( r.challenger );
            eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

            // Check if this game belongs to the action sender
            eosio_assert(r.by == itr->host || r.by == itr->challenger, "this is not your game!");

            // Reset game
            existing_host_games.modify(itr, itr->host, []( auto& g ) {
                g.reset_game();
            });
        }

        // 3、关闭游戏
        // 确保该操作具有来自主机的签名
        // 确保游戏存在
        // 从数据库中删除游戏
        /**
        * @brief Apply close action
        * @param c - action to be applied
        */
        void on(const close& c){
            require_auth(c.host);

            // Check if game exists
            games existing_host_games(code_account, c.host);
            auto itr = existing_host_games.find( c.challenger );
            eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

            // Remove game
            existing_host_games.erase(itr);
        }

        // 4、移动
        // 确保该操作具有来自主持人/挑战者的签名
        // 确保游戏存在
        // 确保游戏尚未完成
        // 确保移动操作由主持人/挑战者完成
        // 确保这是正确的用户
        // 验证移动是否有效
        // 更新新的棋盘
        // 将move_turn更改为其他玩家
        // 确定是否有赢家
        // 将更新的游戏存储到数据库
        /**
        * @brief Check if cell is empty
        * @param cell - value of the cell (should be either 0, 1, or 2)
        * @return true if cell is empty
        */
        bool is_empty_cell(const uint8_t& cell) {
            return cell == 0;
        }
        
        /**
        * @brief Check for valid movement
        * @detail Movement is considered valid if it is inside the board and done on empty cell
        * @param mvt - the movement made by the player
        * @param game_for_movement - the game on which the movement is being made
        * @return true if movement is valid
        */
        bool is_valid_movement(const movement& mvt, const game& game_for_movement) {
            uint32_t movement_location = mvt.row * 3 + mvt.column;
            bool is_valid = movement_location < board_len && is_empty_cell(game_for_movement.board[movement_location]);
            return is_valid;
        }

        // 获胜者被定义为第一个成功将他们的三个标记放置在水平，垂直或对角线上的玩家
        /**
        * @brief Get winner of the game
        * @detail Winner of the game is the first player who made three consecutive aligned movement
        * @param current_game - the game which we want to determine the winner of
        * @return winner of the game (can be either none/ draw/ account name of host/ account name of challenger)
        */
        account_name get_winner(const game& current_game) {
            if((current_game.board[0] == current_game.board[4] && current_game.board[4] == current_game.board[8]) ||
                (current_game.board[1] == current_game.board[4] && current_game.board[4] == current_game.board[7]) ||
                (current_game.board[2] == current_game.board[4] && current_game.board[4] == current_game.board[6]) ||
                (current_game.board[3] == current_game.board[4] && current_game.board[4] == current_game.board[5])) {
                //  - | - | x    x | - | -    - | - | -    - | x | -
                //  - | x | -    - | x | -    x | x | x    - | x | -
                //  x | - | -    - | - | x    - | - | -    - | x | -
                if (current_game.board[4] == 1) {
                    return current_game.host;
                } else if (current_game.board[4] == 2) {
                    return current_game.challenger;
                }
            } else if ((current_game.board[0] == current_game.board[1] && current_game.board[1] == current_game.board[2]) ||
                        (current_game.board[0] == current_game.board[3] && current_game.board[3] == current_game.board[6])) {
                //  x | x | x       x | - | -
                //  - | - | -       x | - | -
                //  - | - | -       x | - | -
                if (current_game.board[0] == 1) {
                    return current_game.host;
                } else if (current_game.board[0] == 2) {
                    return current_game.challenger;
                }
            } else if ((current_game.board[2] == current_game.board[5] && current_game.board[5] == current_game.board[8]) ||
                        (current_game.board[6] == current_game.board[7] && current_game.board[7] == current_game.board[8])) {
                //  - | - | -       - | - | x
                //  - | - | -       - | - | x
                //  x | x | x       - | - | x
                if (current_game.board[8] == 1) {
                    return current_game.host;
                } else if (current_game.board[8] == 2) {
                    return current_game.challenger;
                }
            } else {
                bool is_board_full = true;
                for (uint8_t i = 0; i < board_len; i++) {
                    if (is_empty_cell(current_game.board[i])) {
                    is_board_full = false;
                    break;
                    }
                }
                if (is_board_full) {
                    return N(draw);
                }
            }
            return N(none);
        }
        /**
        * @brief Apply move action
        * @param m - action to be applied
        */
        void on(const move& m) {
            require_auth(m.by);

            // Check if game exists
            games existing_host_games(code_account, m.host);
            auto itr = existing_host_games.find( m.challenger );
            eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

            // Check if this game hasn't ended yet
            eosio_assert(itr->winner == N(none), "the game has ended!");
            // Check if this game belongs to the action sender
            eosio_assert(m.by == itr->host || m.by == itr->challenger, "this is not your game!");
            // Check if this is the  action sender's turn
            eosio_assert(m.by == itr->turn, "it's not your turn yet!");


            // Check if user makes a valid movement
            eosio_assert(is_valid_movement(m.mvt, *itr), "not a valid movement!");

            // Fill the cell, 1 for host, 2 for challenger
            const uint8_t cell_value = itr->turn == itr->host ? 1 : 2;
            const auto turn = itr->turn == itr->host ? itr->challenger : itr->host;
            existing_host_games.modify(itr, itr->host, [&]( auto& g ) {
                g.board[m.mvt.row * 3 + m.mvt.column] = cell_value;
                g.turn = turn;

                //check to see if we have a winner
                g.winner = get_winner(g);
            });
        }

        // apply方法实现对这个契约的事件分派
        void apply( uint64_t /*receiver*/, uint64_t code, uint64_t action ) {

            if (code == code_account) {
                if (action == N(create)) {
                    impl::on(eosio::unpack_action_data<tic_tac_toe::create>());
                } else if (action == N(restart)) {
                    impl::on(eosio::unpack_action_data<tic_tac_toe::restart>());
                } else if (action == N(close)) {
                    impl::on(eosio::unpack_action_data<tic_tac_toe::close>());
                } else if (action == N(move)) {
                    impl::on(eosio::unpack_action_data<tic_tac_toe::move>());
                }
            }
        }
    };
}

/**
*  The apply() methods must have C calling convention so that the blockchain can lookup and
*  call these methods.
*/
extern "C" {

   using namespace tic_tac_toe;
   // apply方法实现对这个契约的事件分派
   void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
      // Put your action handler here
      impl().apply(receiver, code, action);
   }

} // extern "C"