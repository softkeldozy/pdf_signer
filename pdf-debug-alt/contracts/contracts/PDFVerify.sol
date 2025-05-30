// contracts/contracts/PDFVerify.sol
pragma solidity ^0.8.0;

contract PDFVerify {
    mapping(bytes32 => address) public signers;
    
    event DocumentSigned(bytes32 indexed docHash, address signer);

    function storeHash(bytes32 _docHash) external {
        require(signers[_docHash] == address(0), "Already signed");
        signers[_docHash] = msg.sender;
        emit DocumentSigned(_docHash, msg.sender);
    }

    function verify(bytes32 _docHash, address _signer) external view returns (bool) {
        return signers[_docHash] == _signer;
    }
}