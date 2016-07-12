<?php
// +----------------------------------------------------------------------
// | Author: yanzhiwei <yanzhiwei111@163.com>
// +----------------------------------------------------------------------
namespace Home\Controller;
use Think\Log;
/**
 * 民生代付通知类
 */
class PropayController extends HomeController {

	//初始化
	public function __construct(){
		parent::__construct();

		require_once(APP_PATH.'BaoyiPay/shaHelper.php');
	}

	// 服务器对服务器 通知
	public function informurl(){
		//获取代付配置
		$this->config = C('PAID_PAY');

		//获取参数并延签
		$params = I();
		Log::write(print_r($params, true), 'notice params', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');

		$params = sha256Response($params, $this->config['MERKEY']);
		if(!$params){
			Log::write(print_r('延签未通过', true), 'notice bad', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');
			exit;
		}

		//进行数据拆分，存储
		$info = xml2arr($params['xml']);
		$body = $info['body'];

		if($body['tranRespCode'] == 'C000000000'){	//交易成功
			$add_data['tranState'] = '01';
			M('ProjectPayLog')->where(array('bussflowno'=>$body['orgTranFlow']))->save($add_data);
			Log::write(print_r($body['tranRespMsg'], true), 'notice good', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');
  		}else{	//交易失败
  			$add_data['tranState'] = '03';
			$presult = M('ProjectPayLog')->where(array('bussflowno'=>$body['orgTranFlow']))->save($add_data);

			if($presult){
  				$result = M('ProjectPayLog')->field('pro_id')->where(array('bussflowno'=>$body['orgTranFlow']))->find();
  				M('Project')->where(array('id'=>$result['pro_id']))->save(array(
  					'pay_money'=>array('exp','pay_money-'.$body['tranAmt']),
  					'pay_succ_count'=>array('exp','pay_succ_count-1'),
				));
			}
  			Log::write(print_r($body['tranRespMsg'], true), 'notice bad', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');
  		}
	}

	// 服务器对服务器 通知(test)
	public function informurl_test(){
		Log::write(print_r($_REQUEST, true), 'request notice params', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');
		// $params = I();
		// Log::write(print_r($params, true), 'notice params', '', LOG_PATH.'/Admin/Pay/pay_informurl_'.date('y_m_d').'.log');
	}
}