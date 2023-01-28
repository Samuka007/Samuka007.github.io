from alibabacloud_alidns20150109.client import Client as Alidns20150109Client
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_alidns20150109 import models as alidns_20150109_models
from alibabacloud_tea_util import models as util_models
from alibabacloud_tea_util.client import Client as UtilClient
import socket

def getipv6_bysocket():
    host_ipv6=[]
    ips=socket.getaddrinfo(socket.gethostname(),80)
    for ip in ips:
        if ip[4][0].startswith('24'):
    #2408 中国联通
    #2409 中国移动
    #240e 中国电信
    #        print(ip[4][0])
            host_ipv6.append(ip[4][0])
    return host_ipv6

class DDNS:
    def __init__(self):
        pass
    
    # 创建访问用户
    @staticmethod
    def create_client(
        access_key_id: str,
        access_key_secret: str,
    ) -> Alidns20150109Client:
        config = open_api_models.Config(
            access_key_id=access_key_id,
            access_key_secret=access_key_secret
        )
        # 访问的域名
        config.endpoint = f'alidns.cn-hangzhou.aliyuncs.com'
        return Alidns20150109Client(config)
    
    def get_Record(
        client, 
        domain_name, 
        rr = '@', 
        type = 'AAAA'
    ):
        describe_domain_records_request = alidns_20150109_models.DescribeDomainRecordsRequest(
            domain_name=domain_name
        )
        runtime = util_models.RuntimeOptions()
        try:
            # 复制代码运行请自行打印 API 的返回值
            request = client.describe_domain_records_with_options(describe_domain_records_request, runtime)
            print("Lookup Success.")
        except Exception as error:
            # 如有需要，请打印 error
            print("Lookup Failed.")
            print(UtilClient.assert_as_string(error.message))
            
        
        try:
            record = [i for i in request.body.domain_records.record if i.rr == rr and i.type == type]
            # 返回一个ip地址
            return record[0]
        except Exception as error:
            return 0
    
    def initDNS(
        client,
        domain_name,
        rr,
        type,
        value
    ):
        add_domain_record_request = alidns_20150109_models.AddDomainRecordRequest(
            domain_name=domain_name,
            rr=rr,
            type=type,
            value=value
        )
        runtime = util_models.RuntimeOptions()
        try:
            # 复制代码运行请自行打印 API 的返回值
            client.add_domain_record_with_options(add_domain_record_request, runtime)
            print("Init Success.")
        except Exception as error:
            # 如有需要，请打印 error
            print("Init Error.")
            print(UtilClient.assert_as_string(error.message))
            
    
    def syncDNS(
        client,
        rr,
        type,
        value,
        record_id
    ):
        update_domain_record_request = alidns_20150109_models.UpdateDomainRecordRequest(
            rr=rr,
            type=type,
            value=value,
            record_id=record_id
        )
        runtime = util_models.RuntimeOptions()
        try:
            # 复制代码运行请自行打印 API 的返回值
            client.update_domain_record_with_options(update_domain_record_request, runtime)
            print("Sync Success.")
        except Exception as error:
            # 如有需要，请打印 error
            print("Sync Eerror. ID:", record_id)
            print(UtilClient.assert_as_string(error.message))
            

    @staticmethod
    def ddnsServer(
        # 在下面填上你的 AccessKey ID,
        id: str = 'your accesskey id',
        # 在下面填上你的 AccessKey Secret,
        secret: str = 'your accesskey secret',
        # 在下面填上你的域名
        domain_name: str = 'your.domain',
        # 解析类型: 我们用ipv6所以是'AAAA', 如果是ipv4就是'A'
        type: str = 'AAAA',
        # 在下面填上你的主机名
        rr: str = 'name'
    ):#
        client = DDNS.create_client(id, secret)
        get = DDNS.get_Record(client=client, domain_name=domain_name, rr=rr, type=type)
        local = getipv6_bysocket()[0]
        value = get.value
        id = str(get)
        id = id[id.find("'RecordId':")+13:id.find("', 'Status'")]
        if get == 0:
            # 未注册
            DDNS.initDNS(client, domain_name, rr, type, local)
            
        elif value == local:
            # 无需更新
            print("已经是最新。")
        else:
            DDNS.syncDNS(client=client, rr=rr, type=type, value = local, record_id = id)

if __name__ == '__main__':
    DDNS.ddnsServer()