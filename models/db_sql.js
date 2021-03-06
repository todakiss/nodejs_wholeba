/**
 * Created by 장 한솔 on 2015-05-04.
 */

//****************************** USER ************************************//

//회원가입시, 아이디 중복 체크
exports.selectUserId = 'select count(*) as cnt from user where user_id=?';

//회원가입시, 사용자 생성
exports.insertUser = 'insert into user(user_id, user_pw, user_salt, user_phone, user_regid, user_regdate) values(?, ?, ?, ?, ?, ?)';

//회원가입시, 사용자의 리워드 행 생성
exports.insertReward = 'insert into reward(user_no) values(?);';

//로그인시, 해당 user_salt 가져오기
exports.selectUserSalt = 'select user_salt from user where user_id=?';

//로그인시, 입력 아이디와 패스워드와 같은 행이 있는지 조회
exports.selectLogin = 'select user_no, couple_no, user_phone, user_regid, user_islogin, user_regdate, count(*) as cnt from user where user_id=? and user_pw=? and user_withdraw=0';

//로그인시, 사용자의 gcmid, user_phone 갱신
exports.updateUserRegIdandUserPhone = 'update user set user_regid=?, user_phone=? where user_no=? and user_withdraw=0';

//로그인시, 사용자의 전화번호 갱신
exports.updateUserPhone = 'update user set user_phone=? where user_no=?';

//로그인 + 로그아웃시, user_islogin 갱신
exports.updateUserIsLogin = 'update user set user_islogin=? where user_no=?';

//가입정보조회시, 커플인증번호에 사용자 번호가 있는지 체크
exports.selectAuthPhone = 'select couple_no, count(*) as cnt from couple where auth_phone in (select user_phone from user where user_no=?) and couple_is = 0 and couple_withdraw=0';

//가입정보조회시, couple_no 존재할 때 couple_is 조회
exports.selectCoupleIs = 'select couple_is from couple where couple_no=? and couple_withdraw=0;';

//가입정보조회시, couple_is = 1일때, couple_withdraw 조회
exports.selectCoupleWithdraw = 'select couple_withdraw from couple where couple_no=? and couple_withdraw=0;';

//가입정보조회시, couple_is = 1일때, user_addition 조회
exports.selectUserAddition = 'select user_addition from user where user_no=?;';

//가입정보조회시, couple_is = 1 && user_addition = 0 일때, user_req, user_gender 조회, 공통정보등록시, 사용자의 요청자여부 조회
exports.selectUserReqandUserGender = 'select user_no, user_req, user_gender from user where user_no=?';

//가입정보조회시, couple_is = 0 && auth_phone.cnt = 1일때, 커플승인자이므로 상대방의 전화번호 조회
exports.selectPartnerPhone = 'select user_phone from user where couple_no=? and not(user_no=?);';

//가입정보조회시, join_code 세팅 완료후 성별 조회
exports.selectUserGender = 'select user_gender from user where user_no=?';

//사용자 기본값조회(user_no, couple_no, gender, condom(피임여부)
exports.selectUserInfo = 'select user_no, couple_no, user_gender, (select couple_condom from couple where couple_no in (select couple_no from user where user_no=?)) as condom from user where user_no = ?';

//공통정보등록시, 커플의 사귄날 등록
exports.updateCoupleBirth = 'update couple set couple_birth=? where couple_no in (select couple_no from user where user_no = ?);';

//공통정보등록시, 유저의 생일 등록
exports.updateUserBirth = 'update user set user_birth=? where user_no=?';

//공통정보등록시, 유저 기본 Dday 등록
exports.insertBasicDday = '';

//여성정보등록시, 피임약 복용할 경우, pills 테이블에 행 추가
exports.insertPills = 'insert into pills(user_no, pills_date, pills_time) values(?, ?, ?);';

//여성정보등록시, user 테이블에 피임약복용여부 갱신
exports.updateUserPills = 'update user set user_pills=? where user_no=? and user_gender="F";';

//여성정보등록시, period 테이블에 행 추가
exports.insertPeriod = 'insert into period(user_no, period_start, period_end, period_danger, period_cycle) values(?, ?, ?, ?, ?);';

//여성정보등록시, syndrome 테이블에 행 추가
exports.insertSyndrome = 'insert into synlist(user_no, syndrome_no, syndrome_before, syndrome_after) values(?, ?, ?, ?);';

//추가정보입력 후, user_addition 업데이트
exports.updateUserAddition = 'update user set user_addition=1 where user_no=?';

//회원탈퇴를 위한 상대방 reg_id 가져오기
exports.selectOtherRegId = 'select user_regid as other_regid from user where couple_no=? and user_no <> ? and user_withdraw=0';

//회원탈퇴를 위해서 couple_no의 유저들 회원탈퇴 여부 수정
exports.updateUserWithdraw = 'update user set user_withdraw=1 where couple_no=?';

//회원탈퇴를 위해서 couple의 회원탈퇴 여부 수정
exports.updateCoupleWithdraw = 'update couple set couple_withdraw=1 where couple_no=?';

//****************************** COUPLE ************************************//

//커플 요청 시, couple 생성
exports.insertMakeCouple = 'insert into couple(auth_phone) values (?)';

//커플 요청 시, 요청 user의 user_gender, couple_no 업데이트
exports.updateUserGenderandCoupleNoandUserReq = 'update user set user_gender=?, couple_no=?, user_req=1 where user_no=? and user_withdraw=0';

//커플 요청 시, 상대방 user_regid 가져오기(push하기 위해서) - 회원탈퇴에 이미 존재
exports.selectAnswerRegId = 'select user_regid as other_regid from user where couple_no is null and user_phone=? and user_withdraw=0';

//커플 승인자가 맞는지 확인
exports.selectCheckAnswerCouple = 'select couple_no from couple where couple_is=0 and auth_phone=(select user_phone from user where user_no=?)';

//커플 승인 후, couple_is 업데이트
exports.updateCoupleIs = 'update couple set couple_is=1 where couple_no=?';

//커플 승인 시, 요청자 성별에 따른 승인자 성별 및 Regid 구하기
exports.selectOtherGenderandUserRegId = 'select (case user_gender when "M" then "F" when "F" then "M" end) as other_gender, user_regid from user where couple_no=? and user_no <> ? and user_withdraw=0';

//커플 승인 후, 해당 user의 couple_no, gender 업데이트
exports.updateUserCoupleNoandGenderandUserReq = 'update user set couple_no=?, user_gender=?, user_req=0 where user_no=? and user_withdraw=0';

exports.selectCoupleInfo =
  'select (select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_userno, ' +
  //'       (select user_level from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_level, ' +
  '       (select feel_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_condition, ' +
  '	      (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no and a.user_no=r.user_no)) m_reward, ' +
  '       (select user_no from user a where user_gender="F" and a.couple_no=u.couple_no) f_userno, ' +
  //'       (select user_level from user a where user_gender="F" and a.couple_no=u.couple_no) f_level, ' +
  '       (select feel_no from user a where user_gender="F" and a.couple_no=u.couple_no) f_condition, ' +
  '	      (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender="F" and a.couple_no=u.couple_no and a.user_no=r.user_no)) f_reward, ' +
  '       (select couple_condom from couple c where c.couple_no=u.couple_no) couple_condom, ' +
  '       (select couple_birth from couple c where c.couple_no=u.couple_no) couple_birth ' +
  'from user u ' +
  'where u.couple_no=? ' +
  'and u.user_gender="M"';

/*
 select (select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_userno,
 (select user_level from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_level,
 (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no) m_condition,
 (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender=u.user_gender and a.couple_no=u.couple_no and a.user_no=r.user_no)) m_reward,
 (select user_no from user a where user_gender="F" and a.couple_no=u.couple_no) f_userno,
 (select user_level from user a where user_gender="F" and a.couple_no=u.couple_no) f_level,
 (select (select feel_name from feel f where f.feel_no=a.feel_no) from user a where user_gender="F" and a.couple_no=u.couple_no) f_condition,
 (select reward_cnt from reward r where user_no=(select user_no from user a where a.user_gender="F" and a.couple_no=u.couple_no and a.user_no=r.user_no)) f_reward,
 (select couple_condom from couple c where c.couple_no=u.couple_no) couple_condom,
 (select couple_birth from couple c where c.couple_no=u.couple_no) couple_birth
 from user u
 where u.couple_no=1
 and u.user_gender="M";
 */

exports.updateMyCondition = 'update user set feel_no = ? where user_no = ?';

//****************************** D-DAY ************************************//

exports.selectDdayList = 'select dday_no, dday_name, dday_date from dday where couple_no=? and dday_delete=0';

exports.insertDday = 'insert into dday(couple_no, dday_name, dday_date) values(?, ?, ?)';

exports.updateDday = 'update dday set dday_name=?, dday_date=? where couple_no=? and dday_no=?';

exports.deleteDday = 'delete from dday where couple_no = ? and dday_no = ?';


//****************************** LOVE ************************************//

exports.selectLoves = function (data, callback) {
  // 날짜부분
  var date = data.year + '-' + data.month + '-' + '1';

  // 정렬부분
  var orderby;
  switch (parseInt(data.orderby)) {
    case 0:
      orderby = 'loves_date';
      break;
    case 1:
      orderby = 'loves_pregnancy';
      break;
  }

  // between 2015-03-01 and DATE_ADD(DATE_ADD(LAST_DAY(2015-03-01), INTERVAL 1 DAY), INTERVAL -1 SECOND) - 3월을 예로 들면 2015-03-01 00:00:00 ~ 2015-03-31 23:59:59 범위를 갖는다.
  var sql = "select loves_no, loves_condom, loves_pregnancy, loves_date, loves_delete " +
            "from loves " +
            "where couple_no=? " +
            "and loves_date between '" + date + "' and DATE_ADD(DATE_ADD(LAST_DAY('" + date + "'), INTERVAL 1 DAY), INTERVAL -1 SECOND) " +
            "and loves_delete=0 " +
            "order by " + orderby + ' DESC';

  // 동적 sql을 작성한 후 콜백을 통해 값을 넘겨준다.
  callback(sql);
};

//exports.selectLoves = "select loves_no, loves_condom, loves_pregnancy, loves_date, loves_delete " +
//            "from loves " +
//            "where couple_no=? " +
//            "and loves_date between ? and DATE_ADD(DATE_ADD(LAST_DAY(?), INTERVAL 1 DAY), INTERVAL -1 SECOND) " +
//            "order by ? DESC ";

exports.insertLoves = 'insert into loves(couple_no, loves_condom, loves_date) values (?, ?, ?)';
//exports.insertLoves = function (date, callback) {
//  var sql;
//
//  if (date.loves_date){
//    sql =  'insert into loves(couple_no, loves_condom, loves_date) values (?, ?, ?)';
//  } else {
//    sql = 'insert into loves(couple_no, loves_condom, loves_date) values (?, ?, now())';
//  }
//
//  // 동적 sql을 작성한 후 콜백을 통해 sql을 넘겨준다.
//  callback(sql);
//};

exports.updateLoves = 'update loves set loves_condom=?, loves_date=? where couple_no=? and loves_no=?';

exports.deleteLoves = 'update loves set loves_delete = 1 where couple_no=? and loves_no=?';

//****************************** MISSION ************************************//

//미션 생성시, 테마에 따라 랜덤으로 1개 미션 조회
//사용자가 옛날에 수행했던 미션 제외
exports.selectMissionTheme =
  'select mission_no, mission_name, mission_reward, mission_expiration '+
  'from mission m '+
  'where not(m.mission_no in '+
                              '(select mlist.mission_no '+
                              'from missionlist mlist '+
                              'where user_no=?)) '+
  'and theme_no=? '+
  'order by rand() limit 1';

//미션 생성시, 미션 수행할 유저와 그 유저가 가진 진행중인 미션갯수
exports.selectMissionPartner = 'select user_no as partner_no, user_regid as partner_regid, (select count(mlist_no) from missionlist where user_no=partner_no and ((mlist_state=2) or (mlist_state=3))) as mlist_cnt from user where couple_no=? and not(user_no=?)';

//미션 생성
exports.insertMissionlist = 'insert into missionlist(user_no, mission_no, mlist_name, mlist_reward, mlist_state, mlist_regdate)  values(?, ?, ?, ?, 2, now())';

//미션 생성시, 만들어진 미션 조회(푸시로 보낼 정보 얻기 위함)
exports.selectOneMission =
  'select mlist_name, mlist_regdate, '+
        '(select theme_no '+
        'from mission m '+
        'where m.mission_no=mlist.mission_no) as theme_no '+
  'from missionlist mlist '+
  'where mlist_no=? '+
  'and user_no=?';

//미션 생성시, 리워드 차감
exports.updateUserReward = 'update reward set reward_cnt=reward_cnt + ? where user_no=?';

//진행중인 미션조회
exports.selectRunningMission =
  'select mlist_no, '+
          '(select theme_no '+
          'from mission m '+
          'where m.mission_no=mlist.mission_no) as theme_no'+
  ', mlist_name '+
  'from missionlist mlist '+'where user_no=? and mlist_state=3';

//미션 확인시, mission_expiration 조회
exports.selectMissionExpiration = 'select mission_expiration from mission where mission_no=(select mission_no from missionlist where mlist_no=?)';

//미션 확인시, state와 expiredate 갱신
exports.updateMissionConfirm =
  'update missionlist set mlist_state=3, mlist_confirmdate=?, mlist_expiredate=? '+
  'where user_no=? '+
  'and mlist_no=?';

//미션 확인시 푸시보낼 상대방과 보낼내용인 힌트조회
exports.selectMissionConfirmPushInfo =
  'select (select user_regid ' +
            'from user ' +
            'where couple_no=(select couple_no ' +
                              'from user ' +
                              'where user_no=mlist.user_no) ' +
                              'and not(user_no=mlist.user_no)) as partner_regid, ' +
          '(select mission_hint ' +
          'from mission m ' +
          'where m.mission_no=mlist.mission_no) as mission_hint ' +
  'from missionlist mlist ' +
  'where user_no=? ' +
  'and mlist_state=3 ' +
  'and mlist_no=?';

//미션 성공시, mlist_state와 mlist_successdate 갱신
exports.updateMissionSuccess =
  'update missionlist set mlist_state=1, mlist_successdate=now() '+
  'where user_no=? '+
  'and mlist_no=?';

//미션 성공시, 줄 리워드 갯수 조회
exports.selectMissionReward =
  'select mlist_reward '+
  'from missionlist '+
  'where user_no=? '+
  'and mlist_no=?';

//리워드 변화시, 리워드와 user_regid 조회
exports.selectUserReward =
  'select user_regid, '+
          '(select reward_cnt '+
          'from reward '+
          'where user_no=u.user_no)as reward_cnt '+
  'from user u '+
  'where user_no=?';

//미션목록조회
//todo couple_withdraw=0 
exports.selectMissionList =
  'select mlist_no, user_no, mlist_name, mlist_successdate, mlist_regdate, mlist_expiredate, mlist_state, '+
          '(select mission_hint '+
          'from mission mi ' +
          'where mi.mission_no=m.mission_no) mission_hint, ' +
          '(select theme_no '+
          'from mission mi '+
          'where mi.mission_no=m.mission_no) theme_no, '+
          '(select user_gender '+
          'from user u '+
          'where u.user_no=m.user_no) user_gender, '+
          '(select item_usedate '+
          'from itemlist i '+
          'where i.item_usemission=m.mlist_no) item_usedate, '+
          '(select item_no '+
          'from itemlist i '+
          'where i.item_usemission=m.mlist_no) item_no '+
          'from missionlist m '+
          'where user_no IN ((select user_no '+
                              'from user '+
                              'where couple_no=?)) ' +
          'and mlist_regdate between ? and DATE_ADD(DATE_ADD(LAST_DAY(?), INTERVAL 1 DAY), INTERVAL -1 SECOND) '+
          'order by ';


//미션목록조회시, orderby
exports.orderbyLatest = 'm.mlist_confirmdate  IS NULL DESC,  m.mlist_confirmdate  DESC';
exports.orderbyMale = 'user_gender DESC, m.mlist_confirmdate  IS NULL DESC,  m.mlist_confirmdate  DESC';
exports.orderbyFemale = 'user_gender ASC, m.mlist_confirmdate  IS NULL DESC,  m.mlist_confirmdate  DESC';


//****************************** SCHEDULE ************************************//

//미션실패시, 유효기간이 지난 진행중인 미션을 조회
exports.selectMissionFail =
  'select mlist_no '+
  'from missionlist '+
  'where date(mlist_expiredate) <= date(now()) '+
  'and mlist_state=3';

//미션실패시, mlist_state=0 으로 갱신
exports.updateMissionFail = 'update missionlist set mlist_state=0 where mlist_no=? and mlist_state=3';

//미션팝업요청시, 상대방 user_no, regid 조회
exports.selectPartnerNoandRegid =
  'select user_no as partner_no, user_regid as partner_regid '+
  'from user u '+
  'where u.couple_no='+
                      '(select couple_no '+
                      'from user uu where uu.user_no=u.user_no) '+
  'and not(user_no=?)';

//피임약복용시, 유저당 가장 최근것 조회
exports.selectPillstoUpdate =
  'select p.pills_no, p.user_no, '+
          'MAX(p.pills_date)as pills_date, p.pills_time, u.user_pills '+
  'from pills p, user u '+
  'where p.user_no = u.user_no '+
  'and u.user_pills is not null '+
  'group by p.user_no';

//피임약복용시간 추가
exports.insertPillstoUpdate =
  'insert into pills(user_no, pills_time, pills_date) '+
  'values(?, ?, DATE_ADD(date(pills_date), INTERVAL 28 DAY))';

//****************************** ITEMS ************************************//

//아이템 목록조회
exports.selectItems =
  'select item_no, item_name, item_exchange '+
  'from item';

//아이템사용시, 미션의 아이템사용여부조회
exports.selectMissionUseItem =
  'select itemlist_no, count(item_usemission) as cnt '+
  'from itemlist '+
  'where user_no=? '+
  'and item_usemission=?';

//아이템사용시, 아이템 교환칩갯수 조회
exports.selectItemExchange =
  'select item_exchange '+
  'from item '+
  'where item_no=?';

//아이템사용시, insert itemlist
exports.insertItemlist =
  'insert into itemlist(user_no, item_no) '+
  'values(?, ?)';

//아이템 사용시, 바꿀 미션 조회
exports.selectAnotherMission =
  'select mission_no, mission_name, mission_reward, mission_expiration, '+
          '(select mlist_confirmdate from missionlist where mlist_no=?) mlist_confirmdate '+
  'from mission m '+
  'where not(m.mission_no in '+
                              '(select mlist.mission_no '+
                              'from missionlist mlist '+
                              'where user_no=?)) '+
  'and theme_no=? '+
  'order by rand() limit 1';

//아이템 사용시, 새로뽑은 미션으로 업데이트
exports.updateMissionReselected =
  'update missionlist '+
  'set mission_no=?, mlist_name=?, mlist_reward=?, mlist_expiredate=? '+
  'where user_no=? '+
  'and mlist_no=?';

//아이템 사용시, 아이템사용시간과 사용한미션 업데이트
exports.updateItemlistUse =
  'update itemlist '+
  'set item_usedate=?, item_usemission=? '+
  'where user_no=? '+
  'and itemlist_no=?';

//유효기간늘리기 아이템 사용시, 새로 계산된 유효기간으로 업데이트
exports.updateItemExpiredate =
  'update missionlist '+
  'set mlist_expiredate='+
                        '(DATE_ADD(mlist_expiredate, INTERVAL 3 DAY)) '+
  'where user_no=? '+
  'and mlist_no=?';

//패스이용권 사용시, mlist_state = 4로 업데이트
exports.updateUsePassMissionState =
  'update missionlist set mlist_state=4 '+
  'where user_no=? '+
  'and mlist_no=?';

//내마음대로쓰기 아이템 사용시, mlist_name 업데이트
exports.updateCustomMissionName =
  'update missionlist set mlist_name=? '+
  'where user_no=? '+
  'and mlist_no=?';

//아이템 사용시, 푸시보낼정보 조회
exports.selectUseItemPushInfo =
  'select item_usemission, '+
          'item_usedate, '+
          '(select user_regid '+
          'from user '+
          'where couple_no='+
                          '(select couple_no '+
                          'from user '+
                          'where user_no=ilist.user_no) '+
                          'and not(user_no=ilist.user_no)) as partner_regid, '+
          '(select item_name '+
          'from item i '+
          'where i.item_no=ilist.item_no) as item_name,'+
          '(select item_hintchanged '+
          'from item i '+
          'where i.item_no=ilist.item_no) as item_hintchanged,' +
          '(select mission_hint '+
          'from mission '+
          'where mission_no='+
                            '(select mission_no '+
                            'from missionlist m '+
                            'where m.mlist_no=ilist.item_usemission)) as mission_hint '+
  'from itemlist ilist '+
  'where user_no=? '+
  'and itemlist_no=? '+
  'and item_no=?';

//****************************** SETTING ************************************//

//여성정보공개설정
exports.updateUserPublic =
  'update user set user_public=? '+
  'where user_no=? '+
  'and user_gender="F"';

//여성정보조회시, 여자번호와 공개설정 조회
exports.selectWomanUserNo =
  'select user_no as female_no, user_public as female_public '+
  'from user '+
  'where couple_no=? '+
  'and user_gender="F"';

//여성정보조회시, 생리주기 조회
exports.selectUserPeriods =
  'select period_no, period_start, period_end, period_cycle '+
  'from period '+
  'where user_no=? '+
  'order by period_start DESC limit 4';

//여성정보조회시, 피임약복용여부 조회
exports.selectUserPills =
  'select p.pills_no, p.pills_date, p.pills_time, u.user_pills '+
  'from pills p, user u '+
  'where u.user_no=? '+
  'and u.user_gender="F" '+
  'order by pills_date DESC limit 1';
